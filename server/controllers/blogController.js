require('../models/database');

exports.homepage = async(req, res) => {
    try {
        res.render('index', {title: 'Elias Kohut | Blog'});
    } catch (error) {
        res.status(500).send({message:error.message || 'An error occured. Sorry for the inconvenience'});
    }
}

exports.createEntrie = async(req, res) => {
    res.render('createEntrie', {title: "Elias Kohut | Create Entry"})
}