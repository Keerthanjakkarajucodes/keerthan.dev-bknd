import express from 'express';
import {
  getPublicContent,
  updateAbout,
  createProject,
  updateProject,
  deleteProject,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../controllers/contentController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  aboutValidators,
  projectValidators,
  achievementValidators,
  idValidator,
  validate
} from '../middleware/validators.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/public', getPublicContent);

// ADMIN ROUTES - All require authentication
router.put('/about', authenticateToken, aboutValidators, validate, updateAbout);

// Projects
router.post('/projects', authenticateToken, projectValidators, validate, createProject);
router.put('/projects/:id', authenticateToken, idValidator, projectValidators, validate, updateProject);
router.delete('/projects/:id', authenticateToken, idValidator, validate, deleteProject);

// Achievements
router.post('/achievements', authenticateToken, achievementValidators, validate, createAchievement);
router.put('/achievements/:id', authenticateToken, idValidator, achievementValidators, validate, updateAchievement);
router.delete('/achievements/:id', authenticateToken, idValidator, validate, deleteAchievement);

export default router;

