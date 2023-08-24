const controller = require('../controllers/usersController')
module.exports = (router) => {
    router.post('/register', controller.register)
    router.post('/login', controller.login)

    return router
}