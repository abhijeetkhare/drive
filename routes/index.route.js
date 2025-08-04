const express=require('express')
const router= express.Router()
const authMiddleware = require('../middleware/auth'); // adjust path if needed

router.get('/', (req, res) => {
  res.redirect('/user/login'); // or res.render('login') if you're not using redirection
});


router.get('/home',authMiddleware,async (req,res)=>{
    const userFiles = await fileModel.find({ user: req.user.userId });
    console.log("User ID:", req.user.userId);
    console.log("User Files:", userFiles);
    res.render('home', { files: userFiles , user: req.user });
})

const multer = require('multer');
const storage = require('../config/multerStorage'); // adjust path if needed
const upload = multer({ storage });
const fileModel = require('../models/file.model'); // adjust path if needed
const auth = require('../middleware/auth')

router.post('/upload',authMiddleware, upload.single('file'), (req, res) => {
  try {
    console.log("User:", req.user.userId);
    const newfile = new fileModel({
        path: req.file.path,
        orginalname: req.file.originalname,
        user: req.user.userId,
    })
    newfile.save()
    res.redirect('../home');
    console.log("File Uploaded:", {
        userId: req.user.userId,
        filePath: req.file.path,
        originalName: req.file.originalname,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/download/:filepath', authMiddleware, async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;
        const path = req.params.filepath;
        const file = await fileModel.findOne({ filepath: path, user: loggedInUserId });
        if (!file) {    
            return res.status(404).send('File not found or you do not have permission to access it.');
        }
        res.download(file.path, file.orginalname);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('../user/login');
});

router.post('/delete', authMiddleware, async (req, res) => {
  const { filepath } = req.body;

  try {
    const file = await fileModel.findOne({ path: filepath, user: req.user.userId });
    if (!file) return res.status(404).send("File not found");

    // Delete from Cloudinary (if available)
    if (file.cloudinary_id) {
      await cloudinary.uploader.destroy(file.cloudinary_id);
    }

    // Optionally delete local file if needed
    const fs = require('fs');
    fs.unlink(file.path, err => {
      if (err) console.error("Local file not found or already deleted.");
    });

    await fileModel.findByIdAndDelete(file._id);

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


module.exports=router;