const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    source: { type: String, enum: ['youtube', 'instagram'], required: true },
    videoId: { type: String, required: true },
    thumbnail: { type: String },
    description: { type: String },
    views: { type: String, default: '0' },
    date: { type: String }, // formatted date string
    duration: { type: String },
    featured: { type: Boolean, default: false },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
