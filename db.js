// модуль для упрощенного общения с БД PostgreSQL
const {Sequelize} = require('sequelize')

// экспортируем новый объект от класса, и передаем в
// конструктор необходимые данные перед его созданием
module.exports = new Sequelize(
  // передаем в конструктор класса переменные в которых
  // настройки для подключения к БД
  // данные переменные писали в файле .env

  process.env.DB_NAME,      // имя БД к которой нужно подключиться
  process.env.DB_USER,      // пользователь который подключается
  process.env.DB_PASSWORD,  // и пароль его
  {
    dialect: 'postgres',    //  здесь указываем sequelize'y к какой БД хотим подключиться это может быть не только postgres но и mysql
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }

)







