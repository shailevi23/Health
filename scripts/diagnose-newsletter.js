#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');

console.log('Newsletter System Diagnostic Tool');
console.log('===============================\n');

// Check environment variables
console.log('1. Checking environment variables...');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\nPlease run: npm run setup:env');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
}

// Check if Next.js server is running
console.log('\n2. Checking if Next.js development server is running...');
let serverRunning = false;

try {
  const req = http.get('http://localhost:3000/api/test', (res) => {
    if (res.statusCode === 200) {
      serverRunning = true;
      console.log('✅ Next.js server is running');
    } else {
      console.log(`❌ Next.js server responded with status code: ${res.statusCode}`);
    }
  });
  
  req.on('error', (error) => {
    console.log('❌ Next.js server is not running or not accessible');
    console.log('   Please start the server with: npm run dev');
  });
  
  req.end();
} catch (error) {
  console.log('❌ Error checking server status:', error.message);
}

// Check for newsletter components and files
console.log('\n3. Checking for required newsletter files...');
const requiredFiles = [
  'src/components/NewsletterSubscribe.tsx',
  'src/app/api/newsletter/subscribe/route.ts',
  'src/app/api/newsletter/dev-subscribe/route.ts',
  'src/lib/newsletter-service.ts',
  'scripts/create-newsletter-table.sql'
];

const missingFiles = requiredFiles.filter(filePath => !fs.existsSync(path.join(process.cwd(), filePath)));

if (missingFiles.length > 0) {
  console.log('❌ Some required files are missing:');
  missingFiles.forEach(filePath => console.log(`   - ${filePath}`));
} else {
  console.log('✅ All required newsletter files are present');
}

// Print summary and next steps
console.log('\nDiagnostic Summary');
console.log('=================');

if (missingVars.length > 0) {
  console.log('❌ Environment variables: Missing required variables');
} else {
  console.log('✅ Environment variables: All required variables are set');
}

if (serverRunning) {
  console.log('✅ Next.js server: Running');
} else {
  console.log('❌ Next.js server: Not running or not accessible');
}

if (missingFiles.length > 0) {
  console.log('❌ Required files: Some files are missing');
} else {
  console.log('✅ Required files: All files are present');
}

console.log('\nRecommended Next Steps:');
if (missingVars.length > 0) {
  console.log('1. Run "npm run setup:env" to set up your environment variables');
}
if (!serverRunning) {
  console.log(`${missingVars.length > 0 ? '2' : '1'}. Start the Next.js server with "npm run dev"`);
}
console.log(`${missingVars.length > 0 || !serverRunning ? '3' : '1'}. Try subscribing to the newsletter on the website`);
console.log(`${missingVars.length > 0 || !serverRunning ? '4' : '2'}. Check browser console for any errors`);

console.log('\nFor development without Supabase:');
console.log('The app will use an in-memory storage for newsletter subscriptions in development mode');
console.log('This allows you to test the subscription functionality without setting up Supabase'); 