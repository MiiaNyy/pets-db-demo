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

app.get("/", async (req, res)=>{
    try {
        const pets = await db.collection("pets").find().toArray();
        if ( pets.length ) {
            res.render("index", {pets})
        } else {
            res.json("You do not currently have any animals in your pets collection.")
        }
    } catch (err) {
        console.log('Error occurred:', err)
    }
})

app.get("/add", async (req, res)=>{
    try {
        const pets = await db.collection("pets").find().toArray();
        if ( pets.length ) {
            res.render("add", {pets})
        } else {
            res.json("You do not currently have any animals in your pets collection.")
        }
    } catch (err) {
        console.log('Error occurred:', err)
    }
})


app.get("/update", async (req, res)=>{
    try {
        const pets = await db.collection("pets").find().toArray();
        const updatedPet = await db.collection("pets").findOne(ObjectId(req.query.id));
        if ( pets.length && updatedPet ) {
            res.render("update", {pets, updatedPet})
        } else {
            res.json("You do not currently have any animals in your pets collection.")
        }
    } catch (err) {
        console.log('Error occurred:', err)
    }
})

app.get("/delete", async (req, res)=>{
    try {
        const pets = await db.collection("pets").find().toArray();
        const deletePet = await db.collection("pets").findOne(ObjectId(req.query.id));
        if ( pets.length && deletePet ) {
            res.render("delete", {pets, deletePet})
        } else {
            res.json("You do not currently have any animals in your pets collection.")
        }
    } catch (err) {
        console.log('Error occurred:', err)
    }
})

app.delete("/delete", async (req, res)=>{
    try {
        console.log('delete happened')
    } catch (err) {
        console.log('Error occurred:', err)
    }
})
module.exports = app;

