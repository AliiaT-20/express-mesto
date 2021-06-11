const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const ForbiddenError = require('../errors/forbidden-err');
const AuthError = require('../errors/auth-err');
const MongoError = require('../errors/mongo-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new CastError('Пользователь с указанным _id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  console.log('jj');
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new MongoError('Пользователь с таким e-mail уже существует');
        next(error);
      } else if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные пользователя');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Вы не авторизованы'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new CastError('Пользователь с указанным _id не найдена');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      const error = new AuthError('Невозможно авторизоваться');
      next(error);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: name.toString(), about: about.toString() })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные пользователя');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new CastError('Пользователь с указанным _id не найдена');
        next(error);
      } else if (err.name === 'TypeError') {
        const error = new ForbiddenError('Вы можете обновить только свои данные');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданны некорректные данные пользователя');
        next(error);
      } else if (err.name === 'CastError') {
        const error = new CastError('Пользователь с указанным _id не найдена');
        next(error);
      } else if (err.name === 'TypeError') {
        const error = new ForbiddenError('Вы можете обновить только свои данные');
        next(error);
      } else {
        next(err);
      }
    });
};
