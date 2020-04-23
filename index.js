const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoClient=require('mongodb');
const cors=require('cors');
const url='mongodb+srv://david:david@1997@cluster0-xpev5.mongodb.net/MovieDB?retryWrites=true&w=majority';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });  

app.post('/create',function(req,res){
    mongoClient.connect(url,function(err,client){
        if(err) throw err;
        var db=client.db("MovieDB")                           
        db.collection("movies").insertOne(req.body,function(err,data){  
            if(err) throw err;
                client.close();
                res.json({
                    message:"Data inserted"
                })                                       
        })
    })
});

app.get('/movies',function(req,res){
    mongoClient.connect(url,function(err,client){
        if(err) throw err;
        var db=client.db("MovieDB")                           
        var movies = db.collection("movies").find().toArray();
        movies.then(function (data) {
            client.close();
            res.json(data);
        }).catch(function (err) {
                client.close();
                res.json({
                    message: "Error"
                })
            })
    })
});

app.get('/category/:name',function(req,res){
    let name=req.params.name
    mongoClient.connect(url,function(err,client){
        if(err) throw err;
        var db=client.db("MovieDB")                           
        var movies = db.collection("movies").find({ category: name }).toArray();
        movies.then(function (data) {
            client.close();
            res.json(data);
        }).catch(function (err) {
                client.close();
                res.json({
                    message: "Error"
                })
            })
    })
});

app.put("/update", function (req, res) {
    let id=req.body._id;
    mongoClient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db("MovieDB");
        var ObjectId = require('mongodb').ObjectID;
        db.collection("movies").updateOne(
            { _id: ObjectId(id) },
            { $set: {name:req.body.name, category: req.body.category, rating: req.body.rating, image: req.body.image, description: req.body.description} }, function (err, result) {
                if (err) throw err;
                client.close();
                res.json({
                    message: "Movie updated"
                })
            });
    });
});

app.delete("/delete/:id", function (req, res) {
    let id=req.params.id;
    console.log(id);
    var ObjectId = require('mongodb').ObjectID; 
    mongoClient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db("MovieDB");
        console.log(id);
        db.collection("movies").deleteOne({ _id: ObjectId(id) }, function (err, result) {
            if (err) throw err;
            client.close();
            res.json({
                message: "Movie deleted"
            })
        });
    });
});

app.listen(process.env.PORT,function(){
    console.log(process.env.PORT);
});