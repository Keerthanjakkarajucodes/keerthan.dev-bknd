import axios from 'axios';
import MetricsCache from '../models/MetricsCache.js';

const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes

export const fetchLeetCodeStats = async () => {
  try {
    const cache = await MetricsCache.getSingleton();
    
    // Check if cache is valid
    const now = new Date();
    const lastUpdate = cache.leetcode?.updatedAt || new Date(0);
    const cacheAge = now - lastUpdate;
    
    if (cacheAge < CACHE_DURATION && cache.leetcode?.value) {
      return {
        value: cache.leetcode.value,
        url: cache.leetcode.url,
        cached: true
      };
    }

    const username = process.env.LEETCODE_USERNAME;
    
    if (!username) {
      throw new Error('LEETCODE_USERNAME not configured');
    }

    // Try to fetch from LeetCode GraphQL API
    try {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
              reputation
            }
          }
        }
      `;

      const response = await axios.post(
        'https://leetcode.com/graphql',
        {
          query,
          variables: { username }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com'
          },
          timeout: 10000
        }
      );

      if (response.data.errors) {
        throw new Error('LeetCode API returned errors');
      }

      const userData = response.data.data.matchedUser;
      
      if (!userData) {
        throw new Error('User not found');
      }

      const submissions = userData.submitStats.acSubmissionNum;
      const easy = submissions.find(s => s.difficulty === 'Easy')?.count || 0;
      const medium = submissions.find(s => s.difficulty === 'Medium')?.count || 0;
      const hard = submissions.find(s => s.difficulty === 'Hard')?.count || 0;
      const total = submissions.find(s => s.difficulty === 'All')?.count || 0;

      const stats = {
        username: userData.username,
        totalSolved: total,
        easySolved: easy,
        mediumSolved: medium,
        hardSolved: hard,
        ranking: userData.profile?.ranking || null,
        reputation: userData.profile?.reputation || null
      };

      // Update cache
      cache.leetcode = {
        value: stats,
        updatedAt: now,
        url: `https://leetcode.com/${username}`
      };
      await cache.save();

      return {
        value: stats,
        url: cache.leetcode.url,
        cached: false
      };

    } catch (apiError) {
      console.error('LeetCode API Error:', apiError.message);
      
      // Fallback to cached data
      if (cache.leetcode?.value) {
        return {
          value: cache.leetcode.value,
          url: cache.leetcode.url,
          cached: true,
          error: 'Using cached data due to API error'
        };
      }
      
      throw apiError;
    }

  } catch (error) {
    console.error('LeetCode Service Error:', error.message);
    
    // Return cached data if available
    const cache = await MetricsCache.getSingleton();
    if (cache.leetcode?.value) {
      return {
        value: cache.leetcode.value,
        url: cache.leetcode.url,
        cached: true,
        error: 'Using cached data'
      };
    }

    throw new Error(`Failed to fetch LeetCode stats: ${error.message}`);
  }
};

