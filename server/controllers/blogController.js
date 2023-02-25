const Entrie = require('../models/Entrie');

require('../models/database');

const homepage = async (req, res) => {
    try {
        const latestLimit = 5;
        const entries = await Entrie.find({}).sort({ dateAdded: -1 }).limit(latestLimit);
        const audioEntries = await Entrie.find({ filename: /\.mp3$/ }).sort({ dateAdded: -1 }).limit(latestLimit);
        const imageEntries = await Entrie.find({ filename: { $not: /\.mp3$/ } }).sort({ dateAdded: -1 }).limit(latestLimit);
        const loggedIn = req.session.isAuthenticated || false;
        res.render('index', { title: 'Elias Kohut | Blog', entries, audioEntries, imageEntries, loggedIn });
        res.render('index', { title: 'Elias Kohut | Blog', entries, audioEntries, imageEntries });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occured. Sorry for the inconvenience' });
    }
}

const exploreLatest = async (req, res) => {
    try {
        const entries = await Entrie.find({}).sort({ dateAdded: -1 });
        const loggedIn = req.session.isAuthenticated || false;
        res.render('exploreLatest', { title: 'Elias Kohut | Explore Latest', entries, loggedIn});
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occured. Sorry for the inconvenience' });
    }
}

const createEntrie = async (req, res) => {
    const loggedIn = req.session.isAuthenticated || false;
    res.render('createEntrie', { title: "Elias Kohut | Create Entry", loggedIn});
}

const entrie = async (req, res) => {
    try {
        const loggedIn = req.session.isAuthenticated || false;
        const entrie = await Entrie.findById(req.params.id);
        res.render('entrie', { title: `Elias Kohut | ${entrie.name}`, entrie, loggedIn});
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message || 'An error occured. Sorry for the inconvenience' });
    }
};
const images = async (req, res) => {
    try {
        const loggedIn = req.session.isAuthenticated || false;
        const imageEntries = await Entrie.find({ filename: { $not: /\.mp3$/ } }).sort({ dateAdded: -1 });
        res.render('images', { title: 'Elias Kohut | Images', imageEntries, loggedIn });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occured. Sorry for the inconvenience' });
    }
}
const music = async (req, res) => {
    try {
        const loggedIn = req.session.isAuthenticated || false;
        const audioEntries = await Entrie.find({ filename: /\.mp3$/ }).sort({ dateAdded: -1 });
        res.render('music', { title: 'Elias Kohut | Music', audioEntries, loggedIn });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occured. Sorry for the inconvenience' });
    }
}

const about = async (req, res) => {
    const loggedIn = req.session.isAuthenticated || false;
    res.render('about', { title: "Elias Kohut | About Me", loggedIn})
}


let cachedEntrie;
let cachedDate;

// Function to get a random entrie from the database
const getRandomEntrie = async () => {
    const entrie = await Entrie.aggregate([{ $sample: { size: 1 } }]);
    return entrie[0];
};

// Function to get the "thing of today"
const fetchThingOfToday = async () => {
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

const thingOfToday = async (req, res) => {
    const loggedIn = req.session.isAuthenticated || false;
    try {
        const entrie = await fetchThingOfToday();
        res.render('entrie', { title: 'Elias Kohut | Thing of Today', entrie, loggedIn });
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occurred. Sorry for the inconvenience' });
    }
};

const search = async (req, res) => {
    try {
        const loggedIn = req.session.isAuthenticated || false;
        const searchTerm = req.query.q;
        const entries = await Entrie.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        res.render('searchResults', { title: `Elias Kohut | ${searchTerm}`, entries, searchTerm, loggedIn});
    } catch (error) {
        res.status(500).send({ message: error.message || 'An error occurred. Sorry for the inconvenience' });
    }
};

const login = async (req, res) => {
    try {
        const loggedIn = req.session.isAuthenticated || false;
        res.render('login', { title: 'Elias Kohut | Login', message: null, loggedIn});
    } catch (error) {
        const err = error.message ? error.message : null;
        const message = err ? err : null;
        res.status(500).send({ message: message || 'An error occurred. Sorry for the inconvenience' });
    }
};



module.exports = {
    homepage,
    exploreLatest,
    createEntrie,
    entrie,
    about,
    search,
    thingOfToday,
    music,
    images,
    login
}