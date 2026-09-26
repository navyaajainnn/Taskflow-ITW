const express = require('express');
const { body, param } = require('express-validator');
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
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'DONE'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or DONE'),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid date'),
];

const idParamRule = [param('id').isInt().withMessage('Task id must be an integer')];

const taskUpdateRules = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'DONE'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or DONE'),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid date'),
];

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: List the logged-in user's tasks
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, IN_PROGRESS, DONE] }
 *     responses:
 *       200: { description: List of tasks }
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Task created }
 */
router.get('/', getTasks);
router.post('/', taskBodyRules, validate, createTask);

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task by id
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Task found }
 *       404: { description: Task not found }
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Task updated }
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Task deleted }
 */
router.get('/:id', idParamRule, validate, getTask);
router.put('/:id', idParamRule, taskUpdateRules, validate, updateTask);
router.delete('/:id', idParamRule, validate, deleteTask);

module.exports = router;
