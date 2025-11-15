import axios from 'axios';
import MetricsCache from '../models/MetricsCache.js';

const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes

export const fetchLinkedInStats = async () => {
  try {
    const cache = await MetricsCache.getSingleton();
    
    // Check if cache is valid
    const now = new Date();
    const lastUpdate = cache.linkedin?.updatedAt || new Date(0);
    const cacheAge = now - lastUpdate;
    
    if (cacheAge < CACHE_DURATION && cache.linkedin?.value) {
      return {
        value: cache.linkedin.value,
        url: cache.linkedin.url,
        cached: true
      };
    }

    // LinkedIn doesn't have a public API for follower counts
    // Use admin-configured fallback from environment
    const linkedinUrl = process.env.LINKEDIN_URL || 'https://linkedin.com/in/keerthan-jakkaraju';
    
    // For now, return a placeholder that admin can update via admin panel
    const stats = {
      connections: cache.linkedin?.value?.connections || '500+',
      url: linkedinUrl,
      note: 'Update via admin panel or .env'
    };

    // Update cache
    cache.linkedin = {
      value: stats,
      updatedAt: now,
      url: linkedinUrl
    };
    await cache.save();

    return {
      value: stats,
      url: linkedinUrl,
      cached: false
    };

  } catch (error) {
    console.error('LinkedIn Service Error:', error.message);
    
    // Return cached data if available
    const cache = await MetricsCache.getSingleton();
    if (cache.linkedin?.value) {
      return {
        value: cache.linkedin.value,
        url: cache.linkedin.url,
        cached: true,
        error: 'Using cached data'
      };
    }

    throw new Error('Failed to fetch LinkedIn stats');
  }
};

// Admin function to manually update LinkedIn stats
export const updateLinkedInStats = async (connections, url) => {
  try {
    const cache = await MetricsCache.getSingleton();
    
    cache.linkedin = {
      value: {
        connections,
        url: url || process.env.LINKEDIN_URL,
        note: 'Manually updated'
      },
      updatedAt: new Date(),
      url: url || process.env.LINKEDIN_URL
    };
    
    await cache.save();
    return cache.linkedin;
  } catch (error) {
    throw new Error('Failed to update LinkedIn stats');
  }
};

