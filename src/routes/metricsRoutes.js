import express from 'express';
import {
  getGitHubMetrics,
  getLinkedInMetrics,
  getLeetCodeMetrics,
  getAllMetrics
} from '../controllers/metricsController.js';

const router = express.Router();

// PUBLIC ROUTES - No authentication required
router.get('/github', getGitHubMetrics);
router.get('/linkedin', getLinkedInMetrics);
router.get('/leetcode', getLeetCodeMetrics);
router.get('/all', getAllMetrics);

export default router;

