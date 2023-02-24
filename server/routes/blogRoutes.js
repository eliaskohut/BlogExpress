const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const Entrie = require('../models/Entrie')

// serve files from the "public" directory
router.use(express.static(path.join(__dirname, '../public')));

//App Routes
router.get('/', blogController.homepage);

router.get('/createEntrie', blogController.createEntrie);
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



module.exports = router;