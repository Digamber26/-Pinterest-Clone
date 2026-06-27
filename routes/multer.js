const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Create uploads directory path
const uploadDir = path.join(__dirname, '../public/images/uploads');

console.log('📁 Multer module loading...');
console.log('   Upload dir:', uploadDir);

// Synchronously create directory at startup
try {
  const stats = fs.statSync(uploadDir);
  if (!stats.isDirectory()) {
    // If it exists but is not a directory, remove it and recreate
    console.log('⚠️  Uploads path is not a directory, removing it...');
    fs.unlinkSync(uploadDir);
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✓ Upload directory recreated as proper directory');
  } else {
    console.log('✓ Upload directory EXISTS and is a directory');
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    // Directory doesn't exist, create it
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✓ Upload directory CREATED');
  } else {
    console.error('⚠️  Error checking directory:', error.message);
    // Try to create it anyway
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('✓ Upload directory created after error');
    } catch (e) {
      console.error('✗ FAILED to create upload directory:', e.message);
    }
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📤 Destination callback - saving to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = uuidv4() + path.extname(file.originalname);
    console.log('📝 Filename generated:', filename);
    console.log('   Original name:', file.originalname);
    console.log('   Mimetype:', file.mimetype);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('🔍 File filter - checking:', file.originalname);
  if (file.mimetype.startsWith('image/')) {
    console.log('   ✓ Image file accepted');
    cb(null, true);
  } else {
    console.log('   ✗ Not an image, rejected');
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = upload;