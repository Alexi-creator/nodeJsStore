const ApiError = require('../error/ApiError') // для проверки на ошибки

// шифрование данных
const bcrypt = require('bcrypt')

// jwt token
let jwt = require('jsonwebtoken')

// модели user и корзина
const {User, Basket} = require('../models/models')

// делаем jwt токен для пользователя
const generateJwt = (id, email, role) => {
  return jwt.sign(
    // 1-м параметром передаем payload 2-м секретный ключ который
    // находится в файле .env и 3-м параметром сколько будет жить токен на клиенте
    {id, email, role}, 
    process.env.SECRET_KEY, 
    {expiresIn: '24h'}
  )
}

// Контроллер (логика работа) для запросов на api/user/и то что ниже
// делаем класс который вернет объект с методами

class UserController {

  // метод регистрации
  async registration(req, res, next) {
    // берем данные из запроса
    const {email, password, role} = req.body
    // проверяем не пустые ли они, если да то даем ответ и выход из функции
    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password'))
    }
    // проверяем есть ли такой пользователь
    const candidate = await User.findOne({where: {email}})
    // если есть такой пользователь то выдаем ошибку
    if (candidate) {
      return next(ApiError.badRequest('Такой пользователь уже существует'))
    }
    // если такого пользователя нет в БД и он ввел коректно данные
    // создаем его в БД и предварительно хэшируем пароль, 5 это сложность хэша (надежность)
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({email, role, password: hashPassword})
    // сразу же в момент регистрации пользователя создаем его корзину
    // у корзины есть внешний ключ userId в него мы передаем
    // только что создавшийся id нового пользователя из user
    const basket = await Basket.create({userId: user.id})
    // создаем токен пользователя
    const token = generateJwt(user.id, user.email, user.role)
    // последний шаг регистрации заключается в том что отправляется
    // клиенту его токен авторизации
    return res.json({token})
  }

  // метод логинизации
  async login(req, res, next) {
    // берем введеные данные пользователя
    const {email, password} = req.body
    // проверка есть ли такой пользователь по email
    const user = await User.findOne({where: {email}})
    // если нет такого пользователя в БД то возвращаем ошибку
    if (!user) {
      return next(ApiError.internal('пользователь не найден'))
    }
    // иначе проверяем пароль введеный пользователем и тем что
    // лежит в БД, только его нужно расшифровать
    let comparePassword = bcrypt.compareSync(password, user.password)
    // если пароли не совпадают
    if (!comparePassword) {
      return next(ApiError.internal('указан не верный пароль'))
    }
    // если совпадают пароли генерируем токен для пользователя
    const token = generateJwt(user.id, user.email, user.role)
    // и отдаем токен клинету
    return res.json({token})
  }

  // метод проверки авторизации
  // и генерация нового токена для пользователя
  // т.е. если пользователь постоянно использует свой аккаунт то токен будет перезаписываться
  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role)
    return res.json({token})
  }
}

module.exports = new UserController()