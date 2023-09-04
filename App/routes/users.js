const controller = require('../controllers/usersController')
module.exports = (router) => {
    router.post('/register', controller.register)
    router.post('/login', controller.login)
    router.post('/forgot-password', controller.forgotPassword)
    router.post('/reset-password', controller.reserPassword)

    return router
}