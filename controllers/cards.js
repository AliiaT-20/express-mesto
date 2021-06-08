const Card = require('../models/card');
const ValidationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
  .populate('user')
  .then(cards => res.send({data: cards}))
  .catch(next);
}

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
  .then(card => res.send({data: card}))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      const error = new ValidationError("Переданны некорректные данные карточки")
      next(error);
    } else {
      next(err);
    }
  });
}

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner != req.user._id) {
        return Promise.reject(new Error('Вы можете удалить только свою карточку'));
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(card => res.send({data: card}))
        .catch((err) => {
          if (err.name === 'CastError') {
            const error = new CastError('Карточка с указанным _id не найдена');
            next(error);
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      const error = new ForbiddenError('Вы можете только свою карточку');
      next(err);
    })
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },)
  .then(card => res.send({data: card}))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      const error = new ValidationError("Переданны некорректные данные карточки")
      next(error);
    } else if (err.name === 'CastError') {
      const error = new CastError('Карточка с указанным _id не найдена');
      next(error);
    } else {
      next(err);
    }
  });
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },)
  .then(card => res.send({data: card}))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      const error = new ValidationError("Переданны некорректные данные карточки")
      next(error);
    } else if (err.name === 'CastError') {
      const error = new CastError('Карточка с указанным _id не найдена');
      next(error);
    } else {
      next(err);
    }
  });
}