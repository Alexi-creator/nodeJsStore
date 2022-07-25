const Router = require('express')
const router = new Router()
// импортируем контроллер который отвечает за данные 
// роуты которые начинаются на api/user
const userController = require('../controllers/userController')

// подключаем мидлвейр который проверяет авторизацию пользователя
const authMiddleware = require('../middleware/authMiddleware')

// определяем методы post get на запросы user/registration
// user/login итд и при таких запросах запускаем соответствующие контроллеры
router.post('/registration', userController.registration)
router.post('/login', userController.login)

// метод для проверки авторизации
// 2-м параметром передаем мидлвейр который проверяет авторизацию
router.get('/auth', authMiddleware, userController.check)




module.exports = router