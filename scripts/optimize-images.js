const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = '/home/amde/Documents/ElaProject/paperless/public/images/auto play';
const files = fs.readdirSync(targetDir);

async function optimize() {
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const filePath = path.join(targetDir, file);
      const stats = fs.statSync(filePath);
      
      // If > 200KB, optimize it
      if (stats.size > 200 * 1024) {
        console.log(`Optimizing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        const outputName = file.replace(/\.(png|jpg|jpeg)$/, '-opt.png');
        const outputPath = path.join(targetDir, outputName);
        
        try {
          await sharp(filePath)
            .resize({ width: 1200, withoutEnlargement: true })
            .png({ quality: 70, compressionLevel: 9 })
            .toFile(outputPath);
          
          const newStats = fs.statSync(outputPath);
          console.log(`Successfully optimized ${file}. New size: ${(newStats.size / 1024).toFixed(2)} KB (Reduced by ${((1 - newStats.size / stats.size) * 100).toFixed(1)}%)`);
          
          // Replace original with optimized version
          fs.unlinkSync(filePath);
          fs.renameSync(outputPath, filePath);
        } catch (err) {
          console.error(`Error optimizing ${file}:`, err);
        }
      }
    }
  }
}

optimize();
