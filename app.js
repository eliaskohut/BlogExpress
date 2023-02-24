const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 4000;

require('dotenv').config();
mongoose.set('strictQuery', false);


// Connect to database
require('./server/models/database.js');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', './layouts/main');
app.set('view engine', 'ejs')

const routes = require('./server/routes/blogRoutes.js')
app.use('/', routes);

app.listen(port, ()=>console.log('Listening to port '+port));