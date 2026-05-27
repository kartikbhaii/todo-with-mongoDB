const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")


const app = express();
const items = []
let workItems = [];


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true})) // must use to get text from 'html forms' as post request.
 
app.use(express.static("public")) // this includes every file from the public folder for eg. css file or any js file, and includes it to our server.


app.get("/", (req, res) => {
  
  let day = date.getDate();

  res.render("list", { 
    listTitle: day, 
    newListItems: items 
  });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (item === "Work") {
    workItems.push(item)
    res.redirect("/work")
  } else{
    items.push(item)
    res.redirect("/")
  }

});

app.get("/work", (req,res)=>{
  res.render("list", {
    listTitle: "Work List",
     newListItems: workItems
    })
})

app.post("/work", (req,res)=>{
  let item = req.body.newItem
  workItems.push(item)
  res.redirect("/work")
})

app.get("/about", (req,res)=>{
  res.render("about")
})


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
