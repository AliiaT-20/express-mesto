const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
app.use((req, res, next) => {
  req.user = {
    _id: "60ac016f7ae695247ece94b9"
  };
  next();
});
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})

