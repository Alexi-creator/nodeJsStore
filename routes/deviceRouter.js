const Router = require('express')
const router = new Router()

// контроллер импортируем
const deviceController = require('../controllers/deviceController')

// мидлвейр которые проверяет роль
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)


module.exports = router