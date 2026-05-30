require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const DB_URI = process.env.DB_URI;
mongoose.connect(DB_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todolist",
});

const item2 = new Item({
  name: "Hit + button to add new task.",
});

const item3 = new Item({
  name: "Hit checkbox to delete item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema)

app.get("/", (req, res) => {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
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
          newListItems: foundItems,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


app.get("/:customListName", (req,res)=>{
  const customListName = _.capitalize(req.params.customListName)

  List.findOne({ name: customListName })
  .then((foundList) => {
    if (!foundList) {

      // create a new list

      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save()
        .then(() => {
          res.redirect("/" + customListName);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // show an existing list
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
    }
  })
  .catch((err) => {
    console.log(err);
  });
})


app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list

  const newItem = new Item({
    name: itemName,
  });

  if (listName === "Today"){
    newItem.save()
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    List.findOne({name:  listName})
    .then((foundList)=>{
      foundList.items.push(newItem)
      return foundList.save();
    })
    .then(() => {
      res.redirect("/" + listName);
    })
    .catch((err) => {
      console.log(err);
    });
  }

});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName
  
  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
  } 
  
  else {
     List.findOneAndUpdate(
      {name: listName},
      {$pull: {items: {
        _id: checkedItemId
        }}
      } 
    )
    .then(()=>{
      res.redirect("/" + listName)
    })
    .catch((err)=>{
      console.log(err);
      
    })
  }

  
});

 

app.post("/work", (req, res) => {
  let item = req.body.newItem;
  workItems.push(items);
  res.redirect("/work");
});

app.get("/about", (req, res) => {
  res.render("about");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
