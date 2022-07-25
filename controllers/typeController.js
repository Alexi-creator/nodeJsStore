// импортируем модель для типов устройств
const {Type} = require('../models/models')
// импортируем ф-ю проверку на ошибки самописную
const ApiError = require('../error/ApiError')

// Контроллер (логика работа) для запросов на api/type/и то что ниже
// делаем класс который вернет объект с методами

class TypeController {
  // метод создания
  async create(req, res) {
    // т.к. это POST запрос у него есть тело
    const {name} = req.body
    // создаем запись в БД по моделе передав имя в поле таблицы
    const type = await Type.create({name})
    // 
    return res.json(type)
  }
  // метод получения
  async getAll(req, res) {
    const types = await Type.findAll()
    return res.json(types)
  }
}

module.exports = new TypeController()