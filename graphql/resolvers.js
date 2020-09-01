const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { UserInputError } = require('apollo-server')


module.exports = {
    Query: {
      getUsers: async () => {
          try {
              const users = await User.findAll()
              return users
          } catch(err) {
            console.log(err)
          }
      },
    },
    Mutation: {
      register: async (_, args) => {
        let { username, email, password, confirmPassword } = args;
        let errors = {}

        try{
          // validate input data
          if(email.trim() === '') errors.email = 'Email must not be empty'
          if(username.trim() === '') errors.username = 'username must not be empty'
          if(password.trim() === '') errors.password = 'password must not be empty'
          if(confirmPassword.trim() === '') errors.confirmPassword = 'confirmPassword must not be empty'

          if(password !== confirmPassword) errors.confirmPassword = "password must match"
          // check if username/ email. exists
          // const userByUsername = await User.findOne({ where: {username }});
          // const userByEmail = await User.findOne({ where: { email }});

          // if( userByUsername ) errors.username = 'Username is taken'
          // if( userByEmail ) errors.email = 'Email is taken'



          if(Object.keys(errors).length > 0) {
            throw errors
          }

          // hash password
          password = await bcrypt.hash(password, 6)

          // create user
          const user = await User.create({
            username, email, password
          })

          // return user
          return user

        } catch(err) {
          console.log(err)
          if(err.name === 'SequelizeUniqueConstraintError') {
            err.errors.forEach(
              e => (errors[e.value] = `${e.value} is already taken`)   // ???  e.path
            )
          } else if(err.name === 'SequelizeValidationError') {
            err.errors.forEach(e => errors[e.path] = e.message)
          }
          throw new UserInputError('Bad input', { errors })
        }
      },
    },
  };