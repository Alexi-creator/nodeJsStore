// данный мидлвейр декодирует токен и проверяет его на валидность

let jwt = require('jsonwebtoken')


module.exports = function(req, res, next) {
  // если метод запроса не get post а options то пропускаем мидлвейр
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
    // предварительно раскодировав
    // в ф-ю verify передаем 1-м параметром полученный токен пользователя
    // а 2-м секретный ключ(который создали сами) по которому работает шифровка и расшифровка jwt
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
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














