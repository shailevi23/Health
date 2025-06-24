const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('package.json not found. Make sure you are in the project root directory.');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check if nodemailer is already installed
const hasNodemailer = packageJson.dependencies && packageJson.dependencies.nodemailer;

if (!hasNodemailer) {
  console.log('Installing nodemailer...');
  try {
    execSync('npm install nodemailer', { stdio: 'inherit' });
    console.log('Successfully installed nodemailer');
  } catch (error) {
    console.error('Failed to install nodemailer:', error.message);
    process.exit(1);
  }
} else {
  console.log('nodemailer is already installed.');
}

// Check if @types/nodemailer is already installed
const hasNodemailerTypes = packageJson.devDependencies && packageJson.devDependencies['@types/nodemailer'];

if (!hasNodemailerTypes) {
  console.log('Installing @types/nodemailer...');
  try {
    execSync('npm install --save-dev @types/nodemailer', { stdio: 'inherit' });
    console.log('Successfully installed @types/nodemailer');
  } catch (error) {
    console.error('Failed to install @types/nodemailer:', error.message);
    process.exit(1);
  }
} else {
  console.log('@types/nodemailer is already installed.');
}

console.log('\nAll newsletter dependencies installed successfully!');
console.log('\nMake sure to add the following environment variables to your .env file:');
console.log('EMAIL_SERVER_HOST=your-smtp-server.com');
console.log('EMAIL_SERVER_PORT=587');
console.log('EMAIL_SERVER_USER=your-email@example.com');
console.log('EMAIL_SERVER_PASSWORD=your-password');
console.log('EMAIL_FROM=your-email@example.com');
console.log('NEWSLETTER_API_KEY=your-secure-api-key');
console.log('NEXT_PUBLIC_SITE_URL=http://localhost:3000 (or your production URL)'); 