const express = require("express");
const mysql   = require("mysql");
// const sha256  = require("sha256");
const session = require('express-session');
const app = express();
const port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true})); //use to parse data sent using the POST method


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

app.post("/signupProcess", async function(req, res){
  let rows = await insertUser(req.body);
  let message = "Account already exists.";
  let alreadyExists = true;

  if (rows.affectedRows > 0) {
    alreadyExists = false;
  }
  if (alreadyExists){
    res.render("signup", {"message":message})
  } else {
    res.render("index");
  }
  
})


function insertUser(body){
  let connection = dbConnection()

  return new Promise(function(resolve, reject){
    connection.connect(function(err) {
       if (err) throw err;
       console.log("Connected!");
    
       let sql = `INSERT INTO users
                    (username, password)
                     VALUES (?,?)`;
    
       let params = [body.username, body.password];
    
       conn.query(sql, params, function (err, rows, fields) {
          if (err) throw err;
          //res.send(rows);
          connection.end();
          resolve(rows);
       });
    
    });//connect
  });//promise 
}

function dbConnection(){
  let connection = mysql.createConnection({
    host: 'durvbryvdw2sjcm5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'kd892qz9jpxwqtxq',
    password: 'kjjtymmpwpomk5ie',
    database: 'yjwepa0cf8l7lsku'
  })

  return connection
}


function dbSetup() {
  let connection = dbConnection();

  connection.connect()
  //delete tables if they already exists
  // var dropUsers = 'DROP TABLE IF EXISTS cartItem, cart, users, movies'
  // connection.query(dropUsers, function (err, rows, fields) {
  //   if (err) {
  //     throw err
  //   }
  // })

  var createUsers = 'CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(50), password VARCHAR(50), PRIMARY KEY (id));'
  connection.query(createUsers, function (err, rows, fields) {
    if (err) {
      throw err
    }

  })

  //code to create the movies table
  var createMovies = 'CREATE TABLE IF NOT EXISTS movies (id INT NOT NULL AUTO_INCREMENT, title VARCHAR(255), genre VARCHAR(255), rating INT, director VARCHAR(255), summary VARCHAR(500), PRIMARY KEY (id));'
  connection.query(createMovies, function (err, rows, fields) {
    if (err) {
      throw err
    } 

  })

  //create shopping cart table
  var createCart = 'CREATE TABLE IF NOT EXISTS cart (id INT NOT NULL AUTO_INCREMENT, user_id INT NULL DEFAULT NULL, username VARCHAR(50), status VARCHAR(50), PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES users(id));'
  connection.query(createCart, function (err, rows, fields) {
    if (err) {
      throw err
    }

  })

  //create table for items in shopping cart
  var createCartItem = 'CREATE TABLE IF NOT EXISTS cartItem (id INT NOT NULL AUTO_INCREMENT, cart_id INT NOT NULL, productName VARCHAR(255), price DOUBLE, quantity INT, PRIMARY KEY (id), FOREIGN KEY (cart_id) REFERENCES cart(id));'
  connection.query(createCartItem, function (err, rows, fields) {
    if (err) {
      throw err
    }

  })

//uncomment code below for insert testing, must drop rows or table afterwards

  // var sql = "INSERT INTO users (username, password) VALUES ('Bob', '1234')";
  // connection.query(sql, function (err, rows, fields) {
  //   if (err) throw err;
  //   console.log("1 record inserted");
  // });
  // connection.query("SELECT * FROM users", function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(result[0]);
  // });

  connection.end()
}

dbSetup()

//starting server
app.listen(port, () => {
   console.log(`Example app listening on port ${port}!`)
 });
