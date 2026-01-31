const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/images/templet-previev');

async function optimize() {
  if (!fs.existsSync(targetDir)) {
     console.error(`Target directory not found: ${targetDir}`);
     return;
  }
  
  const files = fs.readdirSync(targetDir);
  console.log(`Found ${files.length} files in ${targetDir}`);

  for (const file of files) {
    if (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
      const filePath = path.join(targetDir, file);
      const stats = fs.statSync(filePath);
      
      // If > 200KB, optimize it
      if (stats.size > 200 * 1024) {
        console.log(`Optimizing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        const tempPath = path.join(targetDir, `temp-${file}`);
        
        try {
          await sharp(filePath)
            .resize({ width: 800, withoutEnlargement: true })
            .png({ quality: 75, compressionLevel: 9 })
            .toFile(tempPath);
          
          const newStats = fs.statSync(tempPath);
          console.log(`Successfully optimized ${file}. New size: ${(newStats.size / 1024).toFixed(2)} KB (Reduced by ${((1 - newStats.size / stats.size) * 100).toFixed(1)}%)`);
          
          // Replace original with optimized version
          fs.unlinkSync(filePath);
          fs.renameSync(tempPath, filePath);
        } catch (err) {
          console.error(`Error optimizing ${file}:`, err);
        }
      } else {
        console.log(`Skipping ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      }
    }
  }
}

optimize();
