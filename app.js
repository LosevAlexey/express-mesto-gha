const NotFoundError = require("./constants/NotFoundError");
const express = require("express");
const mongoose = require("mongoose");
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use("/users", routerUsers);
app.use("/cards", routerCards);

app.use('*', (req, res, next) => {
  next(new NotFoundError("Запрашиваемый ресурс не найден"));
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// {"_id":{"$oid":"62320672921704468e5ed5bf"},
