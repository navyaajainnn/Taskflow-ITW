const express = require('express');
const {body,param,query} = require('express-validator');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/auth');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.use(requireAuth);

const taskBodyRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 120 })
    .withMessage('Title must be 120 characters or fewer'),

  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be text')
    .isLength({ max: 1000 })
    .withMessage('Description must be 1000 characters or fewer'),

  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'DONE'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or DONE'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom(isReasonableDueDate),
];

const idParamRule = [param('id').isInt().withMessage('Task id must be an integer')];
const statusQueryRule = [
  query('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'DONE'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or DONE'),
];
const taskUpdateRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 120 })
    .withMessage('Title must be 120 characters or fewer'),

  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be text')
    .isLength({ max: 1000 })
    .withMessage('Description must be 1000 characters or fewer'),
  body('status')
  .optional()
  .isIn(['PENDING', 'IN_PROGRESS', 'DONE'])
  .withMessage('Status must be PENDING, IN_PROGRESS, or DONE'),

body('dueDate')
  .optional({ nullable: true })
  .isISO8601()
  .withMessage('Due date must be a valid date')
  .custom(isReasonableDueDate),
];

function isReasonableDueDate(value) {
  if (!value) return true;

  const selectedDate = new Date(`${value}T00:00:00`);
  const latestAllowedDate = new Date();
  latestAllowedDate.setFullYear(latestAllowedDate.getFullYear() + 1);

  if (selectedDate > latestAllowedDate) {
    throw new Error('Due date cannot be more than 1 year in the future');
  }

  return true;
}


router.get('/', statusQueryRule,validate, getTasks);
router.post('/', taskBodyRules, validate, createTask);


router.get('/:id', idParamRule, validate, getTask);
router.put('/:id', idParamRule, taskUpdateRules, validate, updateTask);
router.delete('/:id', idParamRule, validate, deleteTask);

module.exports = router;