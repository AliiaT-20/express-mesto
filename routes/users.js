const router = require('express').Router();
const { getUsers, getUser, getUserMe, updateUser, updateAvatar } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

router.get('/users', getUsers);
router.get('/users/me', getUserMe);
router.get('/users/:userId', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  })
}), updateAvatar);

module.exports = router;