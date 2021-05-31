const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .populate('user')
  .then(cards => res.send({data: cards}))
  .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
}

module.exports.createCard = (req, res) => {
  const { name, link, userId } = req.body;
  Card.create({ name, link, owner: userId })
  .then(card => res.send({data: card}))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: "Переданы неккоректные данные карточки" })
    } else {
      return res.status(500).send({ message: "Произошла ошибка" });
    }
  });
}

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then(card => res.send({data: card}))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(404).send({ message: "Карточка с указанным _id не найдена." })
    } else {
      res.status(500).send({ message: "Произошла ошибка" })
    }
  });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },)
  .then(card => res.send({data: card}))
  .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },)
  .then(card => res.send({data: card}))
  .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
}