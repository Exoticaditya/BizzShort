#!/usr/bin/env node

/**
 * BizzShort - Installation and Verification Script
 * Ensures all dependencies are installed and environment is properly configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 BizzShort Installation & Verification Script\n');

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark() {
    return `${colors.green}✓${colors.reset}`;
}

function crossmark() {
    return `${colors.red}✗${colors.reset}`;
}

// Check Node.js version
log('\n📋 Checking Node.js version...', 'bright');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion >= 14) {
    log(`${checkmark()} Node.js ${nodeVersion} (Compatible)`, 'green');
} else {
    log(`${crossmark()} Node.js ${nodeVersion} (Requires v14+)`, 'red');
    process.exit(1);
}

// Check if .env file exists
log('\n📋 Checking environment configuration...', 'bright');
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (fs.existsSync(envPath)) {
    log(`${checkmark()} .env file found`, 'green');
    
    // Validate required environment variables
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
    const missingVars = [];
    
    requiredVars.forEach(varName => {
        if (!envContent.includes(varName)) {
            missingVars.push(varName);
        }
    });
    
    if (missingVars.length > 0) {
        log(`${crossmark()} Missing environment variables: ${missingVars.join(', ')}`, 'yellow');
    } else {
        log(`${checkmark()} All required environment variables present`, 'green');
    }
    
    // Check JWT_SECRET strength
    const jwtSecretMatch = envContent.match(/JWT_SECRET=(.+)/);
    if (jwtSecretMatch) {
        const jwtSecret = jwtSecretMatch[1].trim();
        if (jwtSecret.length < 32) {
            log(`${crossmark()} JWT_SECRET is too short (${jwtSecret.length} chars). Recommended: 32+ chars`, 'yellow');
        } else {
            log(`${checkmark()} JWT_SECRET has adequate length`, 'green');
        }
    }
    
} else {
    log(`${crossmark()} .env file not found`, 'red');
    if (fs.existsSync(envExamplePath)) {
        log('   Creating .env from .env.example...', 'yellow');
        fs.copyFileSync(envExamplePath, envPath);
        log(`${checkmark()} .env file created. Please update it with your credentials.`, 'green');
    } else {
        log('   Please create a .env file with required variables', 'red');
    }
}

// Check if node_modules exists
log('\n📋 Checking dependencies...', 'bright');
const nodeModulesPath = path.join(__dirname, 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
    log(`${crossmark()} node_modules not found`, 'red');
    log('   Installing dependencies...', 'yellow');
    
    try {
        execSync('npm install', { stdio: 'inherit' });
        log(`${checkmark()} Dependencies installed successfully`, 'green');
    } catch (error) {
        log(`${crossmark()} Failed to install dependencies`, 'red');
        process.exit(1);
    }
} else {
    log(`${checkmark()} node_modules found`, 'green');
}

// Check package.json for required packages
log('\n📋 Verifying required packages...', 'bright');
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = packageJson.dependencies || {};

const requiredPackages = [
    'express',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'cors',
    'helmet',
    'express-rate-limit',
    'express-mongo-sanitize',
    'xss-clean',
    'validator',
    'multer'
];

let allPackagesPresent = true;
requiredPackages.forEach(pkg => {
    if (dependencies[pkg]) {
        log(`${checkmark()} ${pkg}`, 'green');
    } else {
        log(`${crossmark()} ${pkg} (missing)`, 'red');
        allPackagesPresent = false;
    }
});

if (!allPackagesPresent) {
    log('\n⚠️  Some required packages are missing. Run: npm install', 'yellow');
}

// Check critical files
log('\n📋 Checking project structure...', 'bright');
const criticalFiles = [
    'server.js',
    'config/db.js',
    'models/User.js',
    'models/Article.js',
    'assets/js/admin-enhanced.js',
    'assets/js/live-market-data.js',
    'admin.html',
    'admin-login.html',
    'index.html'
];

criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        log(`${checkmark()} ${file}`, 'green');
    } else {
        log(`${crossmark()} ${file} (missing)`, 'red');
    }
});

// Create uploads directory if it doesn't exist
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    log(`\n${checkmark()} Created uploads/ directory`, 'green');
}

// Security check
log('\n🔒 Security Checklist:', 'bright');
log('   ○ JWT_SECRET set in .env', 'blue');
log('   ○ CORS_ORIGIN configured', 'blue');
log('   ○ NODE_ENV set appropriately', 'blue');
log('   ○ MongoDB connection secured', 'blue');
log('   ○ Rate limiting enabled', 'blue');
log('   ○ Input sanitization active', 'blue');

// Final summary
log('\n═══════════════════════════════════════════════', 'bright');
log('📊 Installation Summary', 'bright');
log('═══════════════════════════════════════════════', 'bright');

if (fs.existsSync(envPath) && allPackagesPresent) {
    log('\n✅ Installation Complete!', 'green');
    log('\n🚀 Next Steps:', 'bright');
    log('   1. Update .env with your MongoDB URI and credentials', 'blue');
    log('   2. Start the server: npm start', 'blue');
    log('   3. Visit setup route: /api/setup-production?key=YOUR_SETUP_KEY', 'blue');
    log('   4. Access admin panel: /admin-login.html', 'blue');
    log('   5. Login with: admin / admin123', 'blue');
    log('\n📚 Documentation:', 'bright');
    log('   - SECURITY_FIXES.md - Security improvements', 'blue');
    log('   - QUICK_START.md - Quick start guide', 'blue');
    log('   - DEPLOYMENT_GUIDE.md - Deployment instructions', 'blue');
} else {
    log('\n⚠️  Installation Incomplete', 'yellow');
    log('   Please address the issues above and run this script again.', 'yellow');
}

log('\n═══════════════════════════════════════════════\n', 'bright');
