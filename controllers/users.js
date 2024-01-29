const bcrypt = require('bcryptjs');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const ValidationError = require("../constants/ValidationError");
const NotFoundError = require("../constants/NotFoundError");
const CastError = require("../constants/CastError");
const ConflictError = require('../constants/ConflictError');
const AuthError = require('../constants/AuthError');

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
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные"));
      } else if (err.code === 11000) {
        next(new ConflictError(`Такой e-mail уже зарегистрирован`));
      } else {
        next(err);
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
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new AuthError('Почта или пароль введены неправильно'));
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findOne({ _id: userId })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};