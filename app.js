const express = require("express");
const mysql   = require("mysql");
// const sha256  = require("sha256");
const session = require('express-session');
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
// app.use(express.urlencoded()); //use to parse data sent using the POST method
app.use(session({ secret: 'any word', cookie: { maxAge: 60000 }}));

// app.use(myMiddleware);

// function myMiddleware(req, res, next){
//   console.log(new Date());
//   next()
// }

//routes
app.get("/", function(req, res){
   res.render("index");
});

app.get("/login", function(req, res){
   res.render("login");
});

app.get("/signup", function(req, res){
   res.render("signup");
});


var PORT = process.env.PORT || 8000;
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
app.listen(PORT, function(){
   console.log("Express server is running...");
});