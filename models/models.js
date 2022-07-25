// импортируем Sequelize из нашего файла db.js где мы его уже вызывали создавали
const sequelize = require('../db')

// DataTypes описывает типы данных для полей таблиц (string, integer итд)
const {DataTypes} = require('sequelize')

// описываем модель User (для таблицы пользователей user в БД)

// define определеяет схему модели, 1-ый аргумент название модели (таблицы)
// 2-ой аргумент в виде объекта уже схема
// primaryKey первичный ключ на который будут ссылаться другие таблицы 
// и так же он будет автоинкрементироваться т.е. сам увеличиваться
// при добавлении(создании) нового пользователя (1,2,3 итд)
// unique уникальное значение для этой таблицы т.е. email должен быть разный
// для каждого разного пользователя
// allowNull: false означает что поле обязательно к заполнению!
const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  // роль пользователя по дефолту USER
  role: {type: DataTypes.STRING, defaultValue: "USER"}
})

// описываем модель корзины
const Basket = sequelize.define('basket', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

// описываем модель для корзины девайса
const BasketDevice = sequelize.define('basket_device', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

// описываем модель для корзины девайса
const Device = sequelize.define('device', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true, allowNull: false},
  price: {type: DataTypes.INTEGER, allowNull: false},
  rating: {type: DataTypes.INTEGER, defaultValue: 0},
  img: {type: DataTypes.STRING, allowNull: false}
})

// описываем модель типа устройства (холодильник, телевизор итд)
const Type = sequelize.define('type', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

// описываем модель бренда (apple, samsung)
const Brand = sequelize.define('brand', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

// описываем модель рейтинга товара
const Rating = sequelize.define('rating', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  rate: {type: DataTypes.INTEGER, allowNull: false}
})

// описываем модель инфо о девайсе
const DeviceInfo = sequelize.define('device_info', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.STRING, allowNull: false}
})

// промежуточная таблица, нужна при создании
// таблиц многие ко многим
const TypeBrand = sequelize.define('type_brand', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})


// описываем как модели связаны с друг другом (1 к 1, 1 ко многим итд)
// т.е. как таблицы ссылаются друг на друга по внешним ключам
// обращаемся к какой либо модели вышенаписанной с ф-ей:

// данная запись говорит о том что запись из таблицы User
// относится к записи в таблице Basket 1 к 1
User.hasOne(Basket)
Basket.belongsTo(User)

// запись User относится ко многим записям Rating
// т.к. 1 пользователь может иметь несколько оценок
User.hasMany(Rating)
Rating.belongsTo(User)

// для корзины и корзины девайса
Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

// для типа девайса и самого девайса
Type.hasMany(Device)
Device.belongsTo(Type)

// для бренда и самого девайса
Brand.hasMany(Device)
Device.belongsTo(Brand)

// для девайса и рейтинга
Device.hasMany(Rating)
Rating.belongsTo(Device)

// для девайса и корзины девайса
Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

// для девайса и инфо о девайсе
Device.hasMany(DeviceInfo, {as: 'info'})
DeviceInfo.belongsTo(Device)

// запись многие ко многим, в данном случае нужна промежуточная
// таблица которую указываем в through
Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})

// экспоритуем все модели
module.exports = {
  User,
  Basket,
  BasketDevice,
  Device,
  Type,
  Brand,
  Rating,
  TypeBrand,
  DeviceInfo
}