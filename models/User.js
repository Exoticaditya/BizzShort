const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'EDITOR', enum: ['ADMIN', 'EDITOR'] },
    status: { type: String, default: 'ACTIVE' },
    avatar: { type: String, default: 'https://ui-avatars.com/api/?name=User&background=random' },
    joinedAt: { type: Date, default: Date.now }
});

// Encryption handled manually in controller/setup
// No pre-save hook to avoid middleware issues

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
