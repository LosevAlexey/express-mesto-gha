const express = require('express');
const mongoose = require('mongoose')
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});


app.use((req, res, next) => {
  req.user = {
    _id: '' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});



const bodyParser = require("body-parser");
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routerUsers);
app.use('/cards', routerCards);

// {"_id":{"$oid":"62320672921704468e5ed5bf"},