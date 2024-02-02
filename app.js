const NotFoundError = require("./constants/NotFoundError");
const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(auth);
app.use(errors());
// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const { login, createUser } = require("../controllers/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use("/users", routerUsers);
app.use("/cards", routerCards);

app.use('*', (req, res, next) => {
  next(new NotFoundError("Запрашиваемый ресурс не найден"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// {"_id":{"$oid":"62320672921704468e5ed5bf"},