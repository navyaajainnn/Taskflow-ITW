const express = require('express');
const {body}= require('express-validator');
const validate =require('../middleware/validate');
const {register,login} = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
  body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ max: 80 })
  .withMessage('Name must be 80 characters or fewer'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
  .isLength({ min: 6, max: 72 })
  .withMessage('Password must be between 6 and 72 characters long'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

module.exports = router;