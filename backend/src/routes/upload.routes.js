const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `car-photo-${uniqueSuffix}${ext}`);
  }
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload car photo
router.post('/car-photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get file path relative to server
    const filePath = req.file.path;
    const fileName = req.file.filename;
    
    // Get server base URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Create full URL to the file
    const fileUrl = `${baseUrl}/uploads/${fileName}`;

    // In a production environment, you'd likely upload to S3 or Supabase Storage
    // This is a simplified example that stores locally
    
    return res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        name: fileName,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: 'Server error uploading file' });
  }
});

// Serve uploaded files (for development purposes)
router.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../uploads', filename);
  res.sendFile(filePath);
});

module.exports = router; 