const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")


const app = express();
// const items = []
// let workItems = [];


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true})) // must use to get text from 'html forms' as post request.
 
app.use(express.static("public")) // this includes every file from the public folder for eg. css file or any js file, and includes it to our server.


mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemSchema = new mongoose.Schema({
  name: String
})

const item = mongoose.model("item", itemSchema)

const item1 = new item({
  name: "Welcome to your todolist"
})
const item2 = new item({
  name: "Hit + button to add new task."
})
const item3 = new item({
  name: "Hit checkbox to delete item."
})

const defaultItems = [item1, item2, item3]








app.get("/", (req, res) => {

  item.find({})
    .then((foundItems) => {

      if (foundItems.length === 0) {

        item.insertMany(defaultItems)
          .then(() => {
            console.log("Successfully saved default items");
            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });

      } else {

        res.render("list", {
          listTitle: "Today",
          newListItems: foundItems
        });

      }

    })
    .catch((err) => {
      console.log(err);
    });

});
app.post("/", (req, res) => {
  const itemName =  req.body.newItem;

  const item = new item({
    name: itemName
  })


  item.save()

  res.redirect("/")
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
