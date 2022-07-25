const {Device, DeviceInfo} = require('../models/models')
const uuid = require('uuid') // для создания уникального имени (для картинок)
const path = require('path') // для работы с путями
const ApiError = require('../error/ApiError')


// Контроллер (логика работа) для запросов на api/user/и то что ниже
// делаем класс который вернет объект с методами

class DeviceController {
  // метод создания
  async create(req, res, next) {
    try {
      let {name, price, brandId, typeId, info} = req.body
      // для тогочто бы педедавать картинку как ссылку(название картинки) в БД
      // нужно установить модуль npm i express-fileupload
      // и зарегестрировать это модуль как мидлвейр в index.js
      const {img} = req.files
      // npm i uuid для работы с уникальными именами файлов (генерирует уникальные id)
      let fileName = uuid.v4() + ".jpg"
      // полученную картинку от клиента с нашим названием
      // кладем в папку static чтобы потом от туда брать для клиента
      // встроенный модуль path а именно __dirname указывает на ту папку
      // где мы пишем сейчас код т.е. controllers и от нее уже выстраивает пути!
      // 2-ой параметр '..' означает что нужно относительно __dirname выйти выше
      // и 3-й парамет найти там папку 'static'
      // 4-й параметр уникальное название
      img.mv(path.resolve(__dirname, '..', 'static', fileName))

      // создаем в БД запись с полями, img передаем просто уникальное название которое создали выше
      const device = await Device.create({name, price, brandId, typeId, img: fileName})

      if (info) {
        // т.к. info приходит строкой ее нужно парсить и там массив
        info = JSON.parse(info)
        info.forEach(i => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id
          })
        })
      }
    
      return res.json(device)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }
  // метод получения всех
  async getAll(req, res) {
    // получаем данные из строки запроса
    // limit и page это чтобы делать пагинацию, что бы не выгружать
    // из БД все товары(например 10000 ед) сразу за раз
    let {brandId, typeId, limit, page} = req.query
    // page по дефолту сделаем 1, page = если все товары / на кол-во товаров показать на странице
    // т.е. page = 1000 / 9 
    page = page || 1
    // лимит по дефолту 9 (9 устройств отобразить на 1 странице)
    limit = limit || 9
    // отступ 
    let offset = page * limit - limit

    let devices;
    // если нет таких данных в запросе
    if (!brandId && !typeId) {
      // делаем запрос в БД чтобы получить данные
      // findAndCountAll нужна для пагинации на фронте чтобы знать сколько всего товаров
      // в ответ из БД придет не только те товары по которым отбирали
      // но и поле count с общим кол-ом товаров
      devices = await Device.findAndCountAll({limit, offset})
    }
    // если есть в запросе бренд но нет типа
    if (brandId && !typeId) {
      // ищем все записи где есть переданный brandId
      // так же передаем сколько нужно позиций достать из БД и отступ
      devices = await Device.findAndCountAll({where:{brandId}, limit, offset})
    }
    // если есть в запросе тип но нет бренда
    if (!brandId && typeId) {
      // ищем все записи где есть переданный typeId
      // так же передаем сколько нужно позиций достать из БД и отступ
      devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
    }
    // если есть и то и то
    if (brandId && typeId) {
      // ищем все записи где есть переданные typeId и brandId
      // так же передаем сколько нужно позиций достать из БД и отступ
      devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset})
    }
    // отправляем полученные данные из запроса в БД в зависимости от запроса клиента
    return res.json(devices)
  }
  // метод получения одного девайса
  async getOne(req, res) {
    // чтобы получить одни товар, например по id, перехватываем id
    // из строки запроса в параметрах params, его мы указали в 
    // роутере '/:id', со строны клиента в строке браузера должен быть
    // запрос ....device/1 - где 1 это и есть :id
    const {id} = req.params
    const device = await Device.findOne(
      {
        where: {id},
        include: [{model: DeviceInfo, as: 'info'}]
      }
    )
    return res.json(device)
  }
}

module.exports = new DeviceController()