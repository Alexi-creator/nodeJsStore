// универсальный файл для ошибок, расширенный классом Error

class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status
    this.message = message
  }

  // статические ф-и(методы) можно вызывать без 
  // создания(объекта) экзепляра класса
  // создаем такие ф-и под разные ошибки кодов
  static badRequest(message) {
    return new ApiError(404, message)
  }

  static internal(message) {
    return new ApiError(500, message)
  }

  static forbidden(message) {
    return new ApiError(403, message)
  }
}

module.exports = ApiError