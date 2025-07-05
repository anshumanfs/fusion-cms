const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building Tailwind CSS...');

// Create the public/css directory if it doesn't exist
const cssDir = path.resolve(__dirname, '../public/css');
if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir, { recursive: true });
}

try {
  // Run tailwindcss CLI to build the CSS
  execSync('npx tailwindcss -i ./public/css/tailwind.css -o ./public/css/tailwind.output.css', { stdio: 'inherit' });
  console.log('Tailwind CSS built successfully!');
} catch (error) {
  console.error('Error building Tailwind CSS:', error);
  process.exit(1);
}
