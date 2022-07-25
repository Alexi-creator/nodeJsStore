const Router = require('express')
const router = new Router()

// контроллер импортируем
const brandController = require('../controllers/brandController')

// мидлвейр которые проверяет роль
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)




module.exports = router