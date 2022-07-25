// здесь главный файл по роутам который объединяет
// все маршруты для API запросов от клиента api/....

const Router = require('express')
const router = new Router()

// импортируем роуты
const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')

// описываем подроуты например при запросе 'api/user' отработает
// роутер userRouter который мы импортировали выше, в том файле
// описаны методы get post итд для адреса '/user'
router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)


module.exports = router


