import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Login validators
export const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

// About validators
export const aboutValidators = [
  body('about').isString().trim().isLength({ min: 10, max: 5000 })
];

// Project validators
export const projectValidators = [
  body('title').isString().trim().isLength({ min: 1, max: 200 }),
  body('description').isString().trim().isLength({ min: 1, max: 2000 }),
  body('tags').optional().isArray(),
  body('repoUrl').optional().isString().trim(),
  body('liveUrl').optional().isString().trim(),
  body('imageUrl').optional().isString().trim()
];

// Achievement validators
export const achievementValidators = [
  body('title').isString().trim().isLength({ min: 1, max: 200 }),
  body('detail').isString().trim().isLength({ min: 1, max: 1000 }),
  body('date').optional().isISO8601()
];

// ID param validator
export const idValidator = [
  param('id').isMongoId()
];

