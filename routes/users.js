// 1. Create an Express router using express.Router().
const router = require('express').Router();
require("../db/conn");
const User = require("../models/users");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = file.originalname.slice(0, -ext.length);
    let fileName = nameWithoutExt + ext;
    let filePath = path.join('uploads', fileName);

    let suffix = 1;
    while (fs.existsSync(filePath)) {
      suffix++;
      fileName = `${nameWithoutExt}_${suffix}${ext}`;
      filePath = path.join('uploads', fileName);
    }

    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });


// 2. Define the route paths and HTTP methods for handling different CRUD operations for user data.
// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// // GET a user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Custom middleware to check the condition
const checkCondition = async (req, res, next) => {
  const { file } = req;

  // Check the condition
  if (!file || file.size > 1024 * 1024) { // Example condition - file size should be less than 1 MB
    return res.status(400).json({ status: 0, msg: 'File is invalid' });
  }
  const isExist = await User.findOne({email: req.body.email});
    if(isExist){
      return res.status(422).json({ status: 0, msg: 'Email already exists' });
    }

  // Condition passed, move to the next middleware
  next();
};


// // POST a new user
router.post('/', upload.single('file'), checkCondition, async (req, res) => {
  try {
      
      const image = req.file.filename;
      const {name, email, mob } = req.body;
      const data = {image, name, email, mob};
      const newUser = new User(data);
      await newUser.save();
      res.status(201).json({ status: 1, msg: 'User Added Successfully' });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, msg: 'Server Error' });
  }
});

// // PUT (update) a user by ID
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    Object.assign(user, req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// // DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 3. Export the router.
module.exports = router;