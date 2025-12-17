const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    targetUrl: { type: String, required: true },
    position: { type: String, required: true, enum: ['header', 'sidebar', 'footer', 'inline'] },
    status: { type: String, default: 'active', enum: ['active', 'paused', 'expired'] },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    metrics: {
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

// Virtual for CTR
AdvertisementSchema.virtual('ctr').get(function () {
    if (this.metrics.impressions === 0) return 0;
    return ((this.metrics.clicks / this.metrics.impressions) * 100).toFixed(2);
});

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
