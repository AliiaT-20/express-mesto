const Card = require('../models/card');
const ValidationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные карточки');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new CastError('Карточка с указанным _id не найдена');
      }
      if (card.owner !== req.user._id) {
        throw new ForbiddenError('Вы можете удалить только свою карточку');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((item) => res.send({ data: item }))
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
      if (err.name === 'TypeError') {
        const error = new CastError('Карточка с указанным _id не найдена');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (card === null) {
        throw new CastError('Карточка с указанным _id не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные карточки');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (card === null) {
        throw new CastError('Карточка с указанным _id не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные карточки');
        next(error);
      } else {
        next(err);
      }
    });
};
