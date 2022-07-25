const {Brand} = require('../models/models')
const ApiError = require('../error/ApiError')

// Контроллер (логика работа) для запросов на api/brand/и то что ниже
// делаем класс который вернет объект с методами

class BrandController {
  // метод создания
  async create(req, res) {
    // т.к. это POST запрос у него есть тело
    const {name} = req.body
    // создаем запись в БД по моделе передав имя в поле таблицы
    const brand = await Brand.create({name})
    
    return res.json(brand)
  }
  // метод получения
  async getAll(req, res) {
   const brands = await Brand.findAll()
   return res.json(brands)
  }
}

module.exports = new BrandController()
