const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken');
const prisma= require('../config/db');
const AppError= require('../utils/AppError');

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

//POST /api/auth/register
//Ismei we check if email hai db mei. 
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return next(new AppError('An account with this email already exists', 409));
    }

    //yahan hum password ko hash kar rahe hai before storing it in the database for security reasons.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const token = signToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
}

//POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = signToken(user);
    res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };