import axios from 'axios';
import MetricsCache from '../models/MetricsCache.js';

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const fetchGitHubStats = async () => {
  try {
    const cache = await MetricsCache.getSingleton();
    
    // Check if cache is valid
    const now = new Date();
    const lastUpdate = cache.github?.updatedAt || new Date(0);
    const cacheAge = now - lastUpdate;
    
    if (cacheAge < CACHE_DURATION && cache.github?.value) {
      return {
        value: cache.github.value,
        url: cache.github.url,
        cached: true
      };
    }

    // Fetch fresh data from GitHub API
    const username = process.env.GITHUB_USERNAME || 'Keerthanjakkarajucodes';
    const token = process.env.GITHUB_TOKEN;
    
    const headers = token ? {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    } : {
      'Accept': 'application/vnd.github.v3+json'
    };

    // Fetch user data
    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`,
      { headers, timeout: 10000 }
    );

    // Fetch repositories
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers, timeout: 10000 }
    );

    const repos = reposResponse.data;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    const stats = {
      followers: userResponse.data.followers,
      publicRepos: userResponse.data.public_repos,
      totalStars,
      totalForks,
      profile: userResponse.data.html_url
    };

    // Update cache
    cache.github = {
      value: stats,
      updatedAt: now,
      url: `https://github.com/${username}`
    };
    await cache.save();

    return {
      value: stats,
      url: cache.github.url,
      cached: false
    };

  } catch (error) {
    console.error('GitHub API Error:', error.message);
    
    // Return cached data if available, even if expired
    const cache = await MetricsCache.getSingleton();
    if (cache.github?.value) {
      return {
        value: cache.github.value,
        url: cache.github.url,
        cached: true,
        error: 'Using cached data due to API error'
      };
    }

    throw new Error('Failed to fetch GitHub stats and no cached data available');
  }
};

