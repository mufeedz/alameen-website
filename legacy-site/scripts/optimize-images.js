const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'assets/images');

function getAllFiles(dirPath, filesArray) {
  filesArray = filesArray || [];
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, filesArray);
    } else {
      filesArray.push(fullPath);
    }
  });
  return filesArray;
}

const allImages = getAllFiles(IMAGES_DIR);
const filesToConvert = allImages.filter(f => f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

async function processImages() {
  console.log(`Found ${filesToConvert.length} images to optimize.`);
  const replacements = [];

  for (const imgPath of filesToConvert) {
    const parsed = path.parse(imgPath);
    const webpPath = path.join(parsed.dir, parsed.name + '.webp');
    const oldFileName = path.basename(imgPath);
    const newFileName = parsed.name + '.webp';
    
    replacements.push([oldFileName, newFileName]);
    console.log(`Converting ${oldFileName} -> ${newFileName}`);
    
    try {
      if (oldFileName.endsWith('.png')) {
        await sharp(imgPath)
          .webp({ quality: 80, lossless: false })
          .toFile(webpPath);
      } else {
         await sharp(imgPath)
          .webp({ quality: 80 })
          .toFile(webpPath);
      }
      fs.unlinkSync(imgPath);
    } catch (e) {
      console.error(`Failed to convert ${imgPath}`, e);
    }
  }

  // Find all HTML, CSS, JS files in ROOT, assets/css, assets/js, partials
  const foldersToCheck = [
    ROOT,
    path.join(ROOT, 'assets/css'),
    path.join(ROOT, 'assets/js'),
    path.join(ROOT, 'partials')
  ];
  
  const allTextFiles = [];
  foldersToCheck.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (['.html', '.css', '.js'].includes(ext)) {
            const p = path.join(dir, file);
            if(fs.statSync(p).isFile()) {
                allTextFiles.push(p);
            }
        }
      });
    }
  });

  let replacedCount = 0;
  for (const file of allTextFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let hasChanges = false;
    
    replacements.forEach(([oldName, newName]) => {
      const escapedOld = oldName.replace(/\./g, '\\.');
      // Look for the filename immediately preceded by non-alphanumeric chars
      const regex = new RegExp(`([^a-zA-Z0-9\\-_])${escapedOld}`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `$1${newName}`);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(file, content);
      replacedCount++;
    }
  }
  
  console.log(`Updated references in ${replacedCount} files.`);
}

processImages().catch(console.error);
