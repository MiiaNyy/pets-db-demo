const express = require("express");
const path = require("path");
const client = require("./db");
const exphbs = require("express-handlebars");
const {ObjectId} = require("mongodb");
const methodOverride = require('method-override')

const db = client.db();
const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(express.json()); // Allow us to use raw json data
app.use(express.urlencoded({extended: false})) // Allows us to use form submission

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res)=>{
    renderPageFromHandlebars(req, res, (pets)=>{
        res.render("index", {pets})
    }).then(r=>console.log('success'))
})

app.get("/add", (req, res)=>{
    renderPageFromHandlebars(req, res, (pets)=>{
        res.render("addPet", {pets})
    }).then(r=>console.log('success'))
})

app.get("/update", (req, res)=>{
    renderPageFromHandlebars(req, res, async (pets)=>{
        const updatedPet = await db.collection("pets").findOne(ObjectId(req.query.id));
        if ( updatedPet ) {
            res.render("updatePet", {pets, updatedPet})
        }
    }).then(r=>console.log('success'))
})

app.get("/delete", (req, res)=>{
    renderPageFromHandlebars(req, res, async (pets)=>{
        const deletePet = await db.collection("pets").findOne(ObjectId(req.query.id));
        if ( deletePet ) {
            res.render("deletePet", {pets, deletePet})
        }
    }).then(r=>console.log('success'))
})


app.post("/add", async (req, res)=>{
    renderPageFromHandlebars(req, res, async ()=>{
        const name = req.body.name;
        const species = req.body.species;
        const age = req.body.age;
        if ( age && species && name ) {
            await db.collection("pets").insertOne({name, species, age});
        }
    }).then(()=>{
        redirectToHomepage(req, res)
        console.log('Successful document add happened')
    })
})

app.put("/update", async (req, res)=>{
    renderPageFromHandlebars(req, res, async ()=>{
        const docFound = await db.collection("pets").find({_id: ObjectId(req.query.id)});
        if ( docFound ) {
            await db.collection("pets").updateOne({_id: ObjectId(req.query.id)}, {
                $set: {
                    name: req.body.name,
                    species: req.body.species,
                    age: req.body.age
                }
            });
        }
    }).then(()=>{
        redirectToHomepage(req, res);
        console.log('Successful document update happened')
    })
})

app.delete("/delete", async (req, res)=>{
    renderPageFromHandlebars(req, res, async ()=>{
        await db.collection("pets").deleteOne({_id: ObjectId(req.query.id)});
        redirectToHomepage(req, res)
    }).then(()=>console.log('Successful delete happened'))
})


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

module.exports = app;

