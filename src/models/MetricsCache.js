import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
  value: mongoose.Schema.Types.Mixed,
  updatedAt: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    default: ''
  }
});

const metricsCacheSchema = new mongoose.Schema({
  github: {
    type: metricSchema,
    default: () => ({ value: null, updatedAt: new Date(), url: '' })
  },
  linkedin: {
    type: metricSchema,
    default: () => ({ value: null, updatedAt: new Date(), url: '' })
  },
  leetcode: {
    type: metricSchema,
    default: () => ({ value: null, updatedAt: new Date(), url: '' })
  }
});

// Ensure only one metrics cache document exists
metricsCacheSchema.statics.getSingleton = async function() {
  let cache = await this.findOne();
  if (!cache) {
    cache = await this.create({});
  }
  return cache;
};

const MetricsCache = mongoose.model('MetricsCache', metricsCacheSchema);

export default MetricsCache;

