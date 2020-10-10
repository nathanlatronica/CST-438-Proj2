const express = require("express");
const mysql   = require("mysql");
// const sha256  = require("sha256");
const session = require('express-session');
const app = express();
const port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
app.use('/public', express.static('public'));
app.use(express.urlencoded()); //use to parse data sent using the POST method


//routes
app.get("/", function(req, res){
  res.render("index");
});

app.get("/cart", function(req, res){
  res.render("cart");
});

app.get("/profile", function(req, res){
  res.render("profile");
});

app.get("/itemDisplay", function(req, res){
  res.render("itemDisplay");
});

app.get("/login", function(req, res){
   res.render("login");
});

app.get("/signup", function(req, res){
   res.render("signup");
});


if (process.env.JAWSDB_URL) {
   var connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
   var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "users_db"
   })
}

function dbConnection(){

   let conn = mysql.createConnection({
                 host: "localhost",
                 user: "root",
             password: "password",
             database: "users_db"
       }); //createConnection

return conn;

}


//starting server
app.listen(port, () => {
   console.log(`Example app listening on port ${port}!`)
 });
