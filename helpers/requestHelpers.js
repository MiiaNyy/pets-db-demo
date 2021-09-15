const client = require("../db");
const db = client.db();

async function renderPageFromHandlebars(req, res, callback) {
    try {
        const pets = await db.collection("pets").find().toArray();
        callback(pets)
    } catch (err) {
        console.log('Error occurred:', err)
    }
}

function redirectToHomepage(req, res) {
    req.method = 'GET';
    res.redirect('/');
}

module.exports = {
    renderPageFromHandlebars,
    redirectToHomepage
}