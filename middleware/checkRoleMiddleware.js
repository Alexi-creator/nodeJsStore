// проверка роли пользователя, чтобы добавлять товар
// на сайт мог только администратор

let jwt = require('jsonwebtoken')

// главная ф-я мидлвейра которая принимает в параметре role
// и возвращает функцию проверки
module.exports = function(role) {

  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    }
    try {
      // проверяем авторизован ли пользователь, взяв его токен
      // берем его из заголовков(которые приходят автоматом от пользователя при запросах)
      const token = req.headers.authorization.split(' ')[1]
      // если токена не пришло значит пользователь не авторизован
      if (!token) {
        return res.status(401).json({message: "не авторизован"})
      }
      // если есть токен его нужно проверить на валидность
      // предварительно раскодировав (в decoded получим объект с 
      // полями id, email, role итд)
      // в ф-ю verify передаем 1-м параметром полученный токен пользователя
      // а 2-м секретный ключ(который создали сами) по которому работает шифровка и расшифровка jwt
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      // проверяем роль из раскодированного токена с ролью которую
      // передали в данную ф-ю мидлвейр checkMiddleware выше
      // если не совпадает выдаем ошибку
      if (decoded.role !== role) {
        return res.status(403).json({message: "нет дуступа"})
      }
      // добавляем в объект req запросов поле user в которое кладем
      // расшифрованный токен от пользователя
      req.user = decoded
      // и передаем исполнение программы дальше на контроллер
      // т.к. это был мидлвейр, в контроллере теперь есть доступ до
      // поля из объекта запросов req.user
      next()
    } catch (e) {
      // если будет ошибка вернем код 401 пользователь не авторизован
      res.status(401).json({message: "не авторизован"})
    }
  }
}
























