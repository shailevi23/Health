#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Determine the user's platform
const platform = os.platform();

console.log('Setting up automated newsletter notifications');
console.log('--------------------------------------------');

// Get the absolute path to the send-notifications.js script
const scriptPath = path.resolve(__dirname, 'send-notifications.js');
const projectRoot = path.resolve(__dirname, '..');

// Make sure the script is executable
try {
  fs.chmodSync(scriptPath, '755');
  console.log('✅ Made send-notifications.js executable');
} catch (error) {
  console.error('❌ Failed to make script executable:', error.message);
}

if (platform === 'win32') {
  // Windows - create a scheduled task
  console.log('\n📝 For Windows, follow these steps to create a scheduled task:');
  console.log('1. Open Task Scheduler (search for it in the Start menu)');
  console.log('2. Click "Create Basic Task" in the right panel');
  console.log('3. Name it "Health Life Newsletter" and click Next');
  console.log('4. Select how often you want to run it (e.g., Daily) and click Next');
  console.log('5. Set the start time and recurrence pattern, then click Next');
  console.log('6. Select "Start a program" and click Next');
  console.log(`7. Browse to Node.js executable (usually C:\\Program Files\\nodejs\\node.exe)`);
  console.log(`8. Add this as the argument: "${scriptPath}"`);
  console.log(`9. Set the "Start in" field to: "${projectRoot}"`);
  console.log('10. Click Next, then Finish');

} else {
  // Linux/macOS - create a crontab entry
  const cronExpression = '0 9 * * *'; // Run at 9 AM every day
  const cronCommand = `${cronExpression} cd ${projectRoot} && /usr/bin/env node ${scriptPath} >> ${projectRoot}/logs/newsletter-$(date +\\%Y\\%m\\%d).log 2>&1`;
  
  // Create logs directory if it doesn't exist
  const logsDir = path.join(projectRoot, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
    console.log('✅ Created logs directory');
  }
  
  console.log('\n📝 For Linux/macOS, you can add this line to your crontab:');
  console.log('\n' + cronCommand);
  console.log('\nTo add it automatically, run:');
  console.log(`(crontab -l 2>/dev/null; echo "${cronCommand}") | crontab -`);
  
  // Ask if the user wants to add it automatically
  console.log('\nWould you like to add this cron job automatically? (y/n)');
  console.log('Note: This will modify your crontab. Press Ctrl+C to cancel if unsure.');
  
  process.stdout.write('> ');
  process.stdin.once('data', (data) => {
    const answer = data.toString().trim().toLowerCase();
    
    if (answer === 'y' || answer === 'yes') {
      try {
        execSync(`(crontab -l 2>/dev/null; echo "${cronCommand}") | crontab -`);
        console.log('✅ Cron job added successfully!');
      } catch (error) {
        console.error('❌ Failed to add cron job:', error.message);
      }
    } else {
      console.log('Skipped adding cron job automatically.');
    }
    
    process.exit(0);
  });
}

// If we're on Windows, we don't need to wait for input
if (platform === 'win32') {
  process.exit(0);
} 