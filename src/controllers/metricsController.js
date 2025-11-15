import { fetchGitHubStats } from '../services/githubService.js';
import { fetchLinkedInStats } from '../services/linkedinService.js';
import { fetchLeetCodeStats } from '../services/leetcodeService.js';

export const getGitHubMetrics = async (req, res) => {
  try {
    const result = await fetchGitHubStats();
    
    res.json({
      success: true,
      data: result.value,
      url: result.url,
      cached: result.cached,
      error: result.error
    });
  } catch (error) {
    console.error('GitHub metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch GitHub metrics',
      details: error.message
    });
  }
};

export const getLinkedInMetrics = async (req, res) => {
  try {
    const result = await fetchLinkedInStats();
    
    res.json({
      success: true,
      data: result.value,
      url: result.url,
      cached: result.cached
    });
  } catch (error) {
    console.error('LinkedIn metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch LinkedIn metrics',
      details: error.message
    });
  }
};

export const getLeetCodeMetrics = async (req, res) => {
  try {
    const result = await fetchLeetCodeStats();
    
    res.json({
      success: true,
      data: result.value,
      url: result.url,
      cached: result.cached,
      error: result.error
    });
  } catch (error) {
    console.error('LeetCode metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch LeetCode metrics',
      details: error.message
    });
  }
};

export const getAllMetrics = async (req, res) => {
  try {
    const [github, linkedin, leetcode] = await Promise.allSettled([
      fetchGitHubStats(),
      fetchLinkedInStats(),
      fetchLeetCodeStats()
    ]);

    res.json({
      success: true,
      data: {
        github: github.status === 'fulfilled' ? github.value : { error: github.reason.message },
        linkedin: linkedin.status === 'fulfilled' ? linkedin.value : { error: linkedin.reason.message },
        leetcode: leetcode.status === 'fulfilled' ? leetcode.value : { error: leetcode.reason.message }
      }
    });
  } catch (error) {
    console.error('All metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch metrics' 
    });
  }
};

