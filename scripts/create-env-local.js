const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\n🌿 Health Blog Environment Setup\n');
  
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    
    // Check if .env.local already exists
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled');
        process.exit(0);
      }
    }

    console.log('\n📝 Please enter your Supabase configuration:\n');
    
    const supabaseUrl = await question('Supabase Project URL: ');
    const supabaseAnonKey = await question('Supabase Anon Key: ');
    const supabaseServiceKey = await question('Supabase Service Role Key: ');

    const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Newsletter Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=your-smtp-password
FROM_EMAIL=newsletter@example.com
FROM_NAME=Health Blog Newsletter
REPLY_TO=support@example.com
`;

    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Environment variables have been set up successfully!');
    console.log('\nℹ️  Next steps:');
    console.log('1. Run the database migrations');
    console.log('2. Start the development server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Error setting up environment variables:', error);
  } finally {
    rl.close();
  }
}

main(); 