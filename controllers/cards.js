const Card = require("../models/card");

const ValidationError = require("../constants/ValidationError");
const CastError = require("../constants/CastError");
const NotFoundError = require("../constants/NotFoundError");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка ${err}` });
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError("Карточка не найдена"));
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

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError("Карточка не найдена"));
      }
    })
  ).catch((err) => {
    if (err.name === "CastError") {
      next(new CastError("Некорректный id"));
    } else {
      next(err);
    }
  });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError("Карточка не найдена"));
      }
    })
  ).catch((err) => {
    if (err.name === "CastError") {
      next(new CastError("Некорректный id"));
    } else {
      next(err);
    }
  });
};
