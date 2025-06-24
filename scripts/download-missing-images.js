const fs = require('fs');
const path = require('path');
const https = require('https');

// Define missing images and their Unsplash sources
const missingImages = [
  {
    path: 'public/images/blog/mindful-eating.jpg',
    url: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    description: 'Mindful eating blog image'
  },
  {
    path: 'public/images/recipes/smoothie-bowl.jpg',
    url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    description: 'Smoothie bowl recipe image'
  },
  {
    path: 'public/images/recipes/buddha-bowl.jpg',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    description: 'Buddha bowl recipe image'
  }
];

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create file stream
    const fileStream = fs.createWriteStream(filepath);
    
    // Download image
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`));
        return;
      }

      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there was an error
      reject(err);
    });

    fileStream.on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Download all missing images
async function downloadAllImages() {
  console.log('Starting download of missing images...');
  
  for (const image of missingImages) {
    try {
      await downloadImage(image.url, image.path);
    } catch (error) {
      console.error(`Error downloading ${image.path}: ${error.message}`);
    }
  }
  
  console.log('Image download complete!');
}

// Run the download function
downloadAllImages(); 