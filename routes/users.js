const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require("../controllers/users");

routerUsers.get("/", getAllUsers);
routerUsers.get("/:me", getUserInfo);

routerUsers.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

routerUsers.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}),updateUser);

routerUsers.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
  }),
}), updateUserAvatar);

module.exports = routerUsers;