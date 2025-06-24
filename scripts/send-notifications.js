#!/usr/bin/env node
require('dotenv').config();
const https = require('https');
const crypto = require('crypto');

// Validate required environment variables
const requiredEnvVars = ['NEXT_PUBLIC_SITE_URL', 'NEWSLETTER_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Configuration
const apiUrl = new URL('/api/newsletter/send-notifications', process.env.NEXT_PUBLIC_SITE_URL);
apiUrl.searchParams.append('apiKey', process.env.NEWSLETTER_API_KEY);

// Generate a request ID for logging
const requestId = crypto.randomBytes(8).toString('hex');

console.log(`[${requestId}] Starting notification process...`);
console.log(`[${requestId}] Sending request to: ${apiUrl.pathname}`);

// Make the API request
const req = https.request(
  apiUrl,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        console.log(`[${requestId}] Status: ${res.statusCode}`);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (response.message === 'No pending notifications') {
            console.log(`[${requestId}] No pending notifications to send.`);
          } else {
            console.log(`[${requestId}] Successfully processed ${response.processed} notification(s).`);
            
            // Log detailed results
            if (response.results && response.results.length > 0) {
              console.log(`[${requestId}] Notification results:`);
              response.results.forEach((result, index) => {
                console.log(`  ${index + 1}. ID: ${result.notificationId}`);
                console.log(`     Status: ${result.status}`);
                
                if (result.status === 'sent') {
                  console.log(`     Recipients: ${result.recipientCount}`);
                } else if (result.status === 'error') {
                  console.log(`     Error: ${result.error}`);
                } else if (result.status === 'skipped') {
                  console.log(`     Reason: ${result.message}`);
                }
              });
            }
          }
        } else {
          console.error(`[${requestId}] Error: ${response.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error(`[${requestId}] Error parsing response:`, error);
        console.error(`[${requestId}] Raw response:`, data);
      }
    });
  }
);

req.on('error', (error) => {
  console.error(`[${requestId}] Request error:`, error);
});

req.end();

console.log(`[${requestId}] Request sent, waiting for response...`); 