// npm run dev - чтобы запустить приложение

// данное подключение отвечает за .env от туда будут браться
// переменные порт итд
require('dotenv').config()

const express = require('express')

// импортируем подключение к БД которое описали в db.js
const sequelize = require('./db')

// cors нужен для того чтобы отправлять запросы с браузера без проблем для междоменных запросов
const cors = require('cors')

// для работы с картинками (отправка в БД название картинки)
const fileUpload = require('express-fileupload')

// импортируем главный роут который отвечает за всю маршрутизацию
const router = require('./routes/index')

// импортируем все модели для разных таблиц
const models = require('./models/models')

// импортируем ф-и по работе с ошибками
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

// встроенный модуль для определения пути

const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()

// cors нужен для того чтобы отправлять запросы с браузера без проблем для междоменных запросов
app.use(cors())

// чтобы наше приложение могло парсить json файлы
app.use(express.json())

// файлы из папки static необходимо раздавать как статику
// т.е. по запросу домена или пока разарботка локалка localhost:5000/здесь любой ресурс
// например имя фото из папки static, клиенту отправится фото

// указываем __dirname это будет означать относительно этой папки index.js
// в которой вызываем path.resolve() и указываем папку static
app.use(express.static(path.resolve(__dirname, 'static')))

// для работы с картинками (отправка в БД название картинки)
app.use(fileUpload({}))

// подключаем роутинг который вынесли в отдельный файл
// он будет срабатывать при запросах '/api'
app.use('/api', router)

// работу с ошибками регистрируем в самом конце!
// т.к. он будет замыкающим
app.use(errorHandler)

// начальный запуск серверного приложения express
const start = async () => {
  try {
    // вызываем подключение к БД с помощью sequelize (это как mangoose для mongo)
    await sequelize.authenticate()
    // сверяет состояние БД со схемой данных
    await sequelize.sync()
    app.listen(PORT, () => console.log(`server port ${PORT}`))
  } catch (e) {
    console.log(e);
  }
}

start()











