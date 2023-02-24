const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
mongoose.set('strictQuery', false);

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



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