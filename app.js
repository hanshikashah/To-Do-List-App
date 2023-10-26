const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");

//console.log(date());

const app=express();
//var items=""; //it will replace the item with the last one thats why we gonna create array

var items=[];

var workitems=[];

app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:true})) // allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
//querystring, qs, query, url, parse, stringify	browser, querystring..
// query, string, qs, param, parameter, url, parse, stringify, encode, decode, searchparams, filter

app.use(express.static("public"));// making some file public like css

//mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});
//mongoose Schema
const itemSchema={
  name:String
};

//mongoose model
const Item= mongoose.model("Item",itemSchema);

const item1= new Item({
  name:"welcome to your todolist!"
});


const item2= new Item({
  name:"hit the + button to aff a new item!"
});


const item3= new Item({
  name:"hit hit!"
});
const defaultitems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemSchema]
};

const List=mongoose.model("List",listSchema);

app.get("/", function(req, res){
  Item.find({},function(err,founditems){
//console.log(founditems);

if(founditems.length===0){
Item.insertMany(defaultitems,function(err,founditems){
    if(err){
      console.log(err)
    }else{
      console.log("success!")
    }
    res.redirect("/");
  });
}else{
  res.render("list",{ listTitle:"Today", newListItems: founditems }); }
});

  });

  app.get("/:customListName",function(req,res){
const customListName=req.params.customListName;

List.findOne({name:customListName},function(err,foundlist){
  if(!err){
    if(!foundlist){
      //console.log("Doesn't Exist!");
      //create a new list
        const list= new List({
        name:customListName,
        items:defaultitems
      });
      list.save();
    }else{
      //console.log("Exist!");
      //show an existing list
      res.render("list",{ listTitle:foundlist.name, newListItems: foundlist.items});
    }
  }
});

});

app.post("/",function(req,res){
// ;Copyright (c) 2018 Copyright Holder All Rights Reserved.

const  newitem7= req.body.newItem;
const listName=req.body.list;
const hanshi=listName.trim();
//console.log(listName);

const newitems3= new Item({
    name:newitem7
  });
  if(hanshi==="Today"){
    newitems3.save()
//sconsole.log("hjdh");
    res.redirect("/")

  }else{
    List.findOne({name:listName}, function(err,foundlist){
  foundlist.items.push(newitems3);

    //console.log(newitems3);
     foundlist.save();
      res.redirect("/"+hanshi);
    })
  }

  });

  app.post("/delete",function(req,res){
  const checkedItemId= req.body.checkbox;
  const listName=req.body.listName;

  if(listName==="Today"){
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("removed successfully!")
      res.redirect("/"+listName);
    
    }
  });

 } else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundlist){
    if(!err){
      console.log("deleted!");
      res.redirect("/"+listName);
    }else{
      console.log(err);  
    }
  })
    }
      });

  //********************************WORK PAGE**********************************************
app.get("/work",function(req,res){
  res.render("list",{listTitle:"work List",newListItems: workitems});//changing title
});

app.post("/work",function(){
  item= req.body.newItem;
  items.push(item);
  res.redirect("/");
  //console.log(req.body);
  console.log(item)
})

//************************************ABOUT PAGE*******************************************
app.get("/about",function(req,res){
  res.render("about");
});

app.listen(3000,function(){
  console.log("server started on port 3000");
});
