const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({data: users}))
  .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
  .then(user => res.send({data: user}))
  .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: "Пользователь по указанному _id не найден" })
      } else {
        res.status(500).send({ message: "Произошла ошибка" })
      }
    }
  );
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
  .then(user => res.send({data: user}))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: "Переданы неккоректные данные пользователя" })
    } else {
      return res.status(500).send({ message: "Произошла ошибка" });
    }
  })
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {name: name.toString(), about: about.toString()})
  .then(user => res.send({data: user}))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: "Переданы неккоректные данные пользователя" })
    } else if (err.name === 'CastError') {
      return res.status(404).send({ message: "Пользователь по указанному _id не найден" })
    } else {
      return res.status(500).send({ message: "Произошла ошибка" });
    }
  })
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
  .then(user => res.send({data: user}))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: "Переданы неккоректные данные пользователя" })
    } else if (err.name === 'CastError') {
      return res.status(404).send({ message: "Пользователь по указанному _id не найден" })
    } else {
      return res.status(500).send({ message: "Произошла ошибка" });
    }
  });
}