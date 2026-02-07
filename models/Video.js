const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    // videoType: 'news' (BizzShort logo) or 'client' (client logo/feature)
    videoType: { type: String, enum: ['news', 'client'], default: 'news' },
    // Display section: where to show this video on the frontend
    section: { type: String, enum: ['breaking-news', 'latest-updates', 'client-features', 'interviews'], default: 'breaking-news' },
    source: { type: String, enum: ['youtube', 'instagram'], required: true },
    videoId: { type: String, required: true },
    thumbnail: { type: String },
    description: { type: String },
    // Transcription text for article display
    transcription: { type: String },
    views: { type: String, default: '0' },
    date: { type: String }, // formatted date string
    duration: { type: String },
    featured: { type: Boolean, default: false },
    tags: [String],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
