const fs = require('fs');
const path = require('path');
const https = require('https');

// Ensure directories exist
const dirs = [
  'public/images/authors',
  'public/images/blog',
  'public/images/recipes'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filepath)) {
      console.log(`File already exists: ${filepath}`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(filepath);
    
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filepath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// List of images to download
const images = [
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    path: 'public/images/authors/sarah.jpg',
    description: 'Author profile photo'
  },
  {
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
    path: 'public/images/blog/mindful-eating.jpg',
    description: 'Mindful eating blog post cover'
  },
  {
    url: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
    path: 'public/images/blog/intermittent-fasting.jpg',
    description: 'Intermittent fasting blog post cover'
  },
  {
    url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    path: 'public/images/blog/fitness-routine.jpg',
    description: 'Fitness routine blog post cover'
  },
  {
    url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
    path: 'public/images/recipes/chickpea-salad.jpg',
    description: 'Mediterranean chickpea salad recipe cover'
  },
  {
    url: 'https://images.unsplash.com/photo-1578536374283-9212cc0c5881',
    path: 'public/images/recipes/turmeric-latte.jpg',
    description: 'Golden turmeric latte recipe cover'
  }
];

// Download all images
async function downloadAllImages() {
  console.log('Starting to download images...');
  
  for (const image of images) {
    try {
      await downloadImage(`${image.url}?auto=format&fit=crop&w=800&q=80`, image.path);
    } catch (error) {
      console.error(`Error downloading ${image.path}:`, error.message);
    }
  }
  
  console.log('All images downloaded successfully!');
  console.log('\nNext steps:');
  console.log('1. Run the Supabase direct insert script with:');
  console.log('   node scripts/supabase-direct-insert.js');
  console.log('2. You\'ll need your Supabase URL and service role key from the Supabase dashboard');
}

// Run the download process
downloadAllImages().catch(error => {
  console.error('An error occurred during the download process:', error);
}); 