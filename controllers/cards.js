const Card = require("../models/card");

const CastError = require("../constants/CastError");
const NotFoundError = require("../constants/NotFoundError");
const ForbiddenError = require("../constants/ForbiddenError");

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
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => res.send({ data: card }))
          .catch(next);
      } else {
        throw new ForbiddenError("Нельзя удалить чужую карточку");
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
    { new: true }.then((card) => {
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
    { new: true }.then((card) => {
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
