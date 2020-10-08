const express = require('express')
const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
app.use('/public', express.static('public'));
app.use(express.urlencoded()); //use to parse data sent using the POST method


app.get("/", function(req, res){
   res.render("home");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});