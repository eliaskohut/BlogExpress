const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

//App Routes
router.get('/', blogController.homepage);

module.exports=router;