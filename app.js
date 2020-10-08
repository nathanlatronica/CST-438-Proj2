const express = require('express')
const app = express();
const port = 8000;

app.get("/", function(req, res){
   res.render("home");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
