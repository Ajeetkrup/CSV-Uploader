const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

//setting up dotenv
const dotenv = require("dotenv");
// get config vars
dotenv.config();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("assets"));

app.use(expressLayouts);
//extract layout and scripts from sub pages to layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error on running the server : ${err}`);
    return;
  }

  console.log(`Server is successfully running at port : ${port}`);
});
