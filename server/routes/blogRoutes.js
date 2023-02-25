const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const session = require('express-session');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const Entrie = require('../models/Entrie');
const User = require('../models/User');

// serve files from the "public" directory
router.use(express.static(path.join(__dirname, '../public')));

// setup express-session middleware
router.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
}));

//App Routes
router.get('/',
  blogController.homepage
);

router.get('/createEntrie', (req, res) => {
  // check if user is authenticated
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  blogController.createEntrie(req, res);
});

router.post('/createEntrie', upload.single('file'), async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const type = file.mimetype.startsWith('audio') ? 'audio' : 'image';
  const description = req.body.description || null;
  const filename = file.originalname;

  const entrie = new Entrie({ name, type, description, filename });
  try {
    await entrie.save();
    res.redirect('/createEntrie');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/explore-latest', blogController.exploreLatest);

router.get('/entrie/:id', blogController.entrie);

router.get('/images', blogController.images);

router.get('/music', blogController.music);

router.get('/about', blogController.about);

router.get('/thing-of-today', blogController.thingOfToday);

router.get('/search', blogController.search);

router.get('/login', blogController.login);

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        req.session.isAuthenticated = true;
        req.session.user = user;
        return res.redirect('/createEntrie');
      }
    }
    throw new Error('Invalid credentials');
  } catch (error) {
    console.error(error);
    const loggedIn = req.session.isAuthenticated || false;
    res.render('login', { message: 'Invalid credentials', loggedIn});
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('*', function(req, res){
  res.redirect('/');
});

module.exports = router;
