const prisma = require('../config/db');
const AppError = require('../utils/AppError');

// GET /api/tasks
async function getTasks(req, res, next) {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
}

// GET /api/tasks/:id
async function getTask(req, res, next) {
  try {
    const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } });
    if (!task || task.userId !== req.user.id) {
      return next(new AppError('Task not found', 404));
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id,
      },
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing || existing.userId !== req.user.id) {
      return next(new AppError('Task not found', 404));
    }

    const { title, description, status, dueDate } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing || existing.userId !== req.user.id) {
      return next(new AppError('Task not found', 404));
    }

    await prisma.task.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
