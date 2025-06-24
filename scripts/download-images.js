const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories if they don't exist
const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Download an image
const downloadImage = (url, filePath) => {
  return new Promise((resolve, reject) => {
    createDir(path.dirname(filePath));
    
    if (fs.existsSync(filePath)) {
      console.log(`File already exists: ${filePath}`);
      resolve();
      return;
    }
    
    console.log(`Downloading: ${url} to ${filePath}`);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filePath}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
};

// Main function
async function main() {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      path: 'public/images/authors/sarah.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      path: 'public/images/products/blender.jpg'
    },
    {
      url: 'https://images.unsplash.com/photo-1592432678016-e910934315b9?auto=format&fit=crop&w=800&q=80',
      path: 'public/images/products/yoga-mat.jpg'
    }
  ];
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.path);
    } catch (error) {
      console.error(`Error downloading ${image.path}:`, error.message);
    }
  }
  
  console.log('All downloads completed!');
}

main().catch(console.error); 