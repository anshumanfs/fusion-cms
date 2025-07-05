const fs = require('fs-extra');
const path = require('path');

// Paths
const viewsSrc = path.join(__dirname, '../views');
const viewsDest = path.join(__dirname, '../.build/views');
const publicSrc = path.join(__dirname, '../public');
const publicDest = path.join(__dirname, '../.build/public');

// Ensure .build directory exists
fs.ensureDirSync(path.join(__dirname, '../.build'));

// Copy views directory
console.log('Copying views directory...');
fs.copySync(viewsSrc, viewsDest, { overwrite: true });
console.log('Views directory copied successfully!');

// Copy public directory
console.log('Copying public directory...');
fs.copySync(publicSrc, publicDest, { overwrite: true });
console.log('Public directory copied successfully!');
