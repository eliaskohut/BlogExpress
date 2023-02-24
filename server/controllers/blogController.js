const Entrie = require('../models/Entrie');

require('../models/database');

exports.homepage = async (req, res) => {
    try {
        const latestLimit = 5;
        const entries = await Entrie.find({}).sort({ dateAdded: -1 }).limit(latestLimit);
        const audioEntries = await Entrie.find({ filename: /\.mp3$/ }).sort({ dateAdded: -1 }).limit(latestLimit);
        const imageEntries = await Entrie.find({ filename: { $not: /\.mp3$/ } }).sort({ dateAdded: -1 }).limit(latestLimit);
        res.render('index', { title: 'Elias Kohut | Blog', entries, audioEntries, imageEntries });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occured. Sorry for the inconvenience' });
    }
}

exports.exploreLatest = async (req, res) => {
    try {
        const entries = await Entrie.find({}).sort({ dateAdded: -1 });
        res.render('exploreLatest', { title: 'Elias Kohut | Explore Latest', entries });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occured. Sorry for the inconvenience' });
    }
}

exports.createEntrie = async (req, res) => {
    res.render('createEntrie', { title: "Elias Kohut | Create Entry" });
}

exports.entrie = async (req, res) => {
    try {
        const entrie = await Entrie.findById(req.params.id);
        res.render('entrie', { title: `Elias Kohut | ${entrie.name}`, entrie });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message || 'An error occured. Sorry for the inconvenience' });
    }
};
exports.images = async (req, res) => {
    try {
        const imageEntries = await Entrie.find({ filename: { $not: /\.mp3$/ } }).sort({ dateAdded: -1 });
        res.render('images', { title: 'Elias Kohut | Images', imageEntries });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occured. Sorry for the inconvenience' });
    }
}
exports.music = async (req, res) => {
    try {
        const audioEntries = await Entrie.find({ filename: /\.mp3$/ }).sort({ dateAdded: -1 });
        res.render('music', { title: 'Elias Kohut | Music', audioEntries });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occured. Sorry for the inconvenience' });
    }
}

exports.about = async (req, res) => {
    res.render('about', { title: "Elias Kohut | About Me" })
}


let cachedEntrie;
let cachedDate;

// Function to get a random entrie from the database
const getRandomEntrie = async () => {
    const entrie = await Entrie.aggregate([{ $sample: { size: 1 } }]);
    return entrie[0];
};

// Function to get the "thing of today"
const thingOfToday = async () => {
    // If the cached entrie is still valid, return it
    const currentDate = new Date().toDateString();
    if (cachedEntrie && cachedDate === currentDate) {
        return cachedEntrie;
    }

    // Otherwise, get a new random entrie, cache it, and return it
    const entrie = await getRandomEntrie();
    cachedEntrie = entrie;
    cachedDate = currentDate;
    return entrie;
};

exports.thingOfToday = async (req, res) => {
    try {
        const entrie = await thingOfToday();
        res.render('entrie', { title: 'Elias Kohut | Thing of Today', entrie });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occurred. Sorry for the inconvenience' });
    }
};

exports.search = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const entries = await Entrie.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        res.render('searchResults', { title: `Elias Kohut | ${searchTerm}`, entries, searchTerm});
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occurred. Sorry for the inconvenience' });
    }
};