// данный мидлвейр для перехвата ошибок
const ApiError = require('../error/ApiError')

module.exports = function(err, req, res, next) {
  // если класс ошибки ApiError
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message})
  }
  return res.status(500).json({message: "непредвиденная ошибка!"})
}




