const User = require("../models/user");

const ValidationError = require("../constants/ValidationError");
const NotFoundError = require("../constants/NotFoundError");
const CastError = require("../constants/CastError");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        next(new NotFoundError("Пользователь не найден"));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new CastError("Некорректный id"));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные"));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError("Пользователь не найден"));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new CastError("Переданы некорректные данные"));
      } else if (err.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError("Пользователь не найден"));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new CastError("Переданы некорректные данные"));
      }
    });
};
