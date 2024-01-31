const Card = require("../models/card");

const CastError = require("../constants/CastError");
const NotFoundError = require("../constants/NotFoundError");

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((result) => res.send(result))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new CastError("Переданы некорректные данные"));
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
