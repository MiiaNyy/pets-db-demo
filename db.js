
const dotenv = require("dotenv");
const MongoClient = require("mongodb").MongoClient;

dotenv.config(); // Using this we can access environmental variables

MongoClient.connect(process.env.CONNECTIONSTRING, (err, client)=>{
    if ( err ) throw err;
    module.exports = client;

    const app = require("./app.js");
    // After you have access to database, start listening to port
    app.listen(process.env.PORT || 3000, () => console.log('Started listening port...'))

})