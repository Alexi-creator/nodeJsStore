const Router = require('express')
const router = new Router()

// контроллер импортируем
const typeController = require('../controllers/typeController')

// мидлвейр которые проверяет роль
const checkRole = require('../middleware/checkRoleMiddleware')

// 2-м параметром передаем мидлвейр с ролью на которую нужно проверить
router.post('/', checkRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)


module.exports = router