const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const {Bookmarks} = require('./models/bookmarkModel');

app.use(morgan('dev'));
app.use(express.static('public'));
app.listen(8080, () => {
    console.log("This server is running on port 8080");
    new Promise((resolve, reject) =>{
        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };
        mongoose.connect(DATABASE_URL, settings, (err) => {
            if(err){
                return reject(err);
            }
            else{
                console.log("Connected succesfully");
                return resolve();
            }
        })

    })
    .catch(err => {
        console.log(err);
    });
})

const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function middleware(req, res, next){
    let token = req.headers.authorization;
    console.log(token);
    if(token){
        if(token != `Bearer ${TOKEN}`){
            res.statusMessage = "Unathorized access, wrong key";
            return res.status(401).end();
        }
        else{
            next();
        }
    }
    else{
        token = req.headers["book-api-key"];
        console.log(token);
        if(token){
            console.log("Entra al 2do token");
            if(token != TOKEN){
                res.statusMessage = "Unathorized access, wrong key";
                return res.status(401).end();
            }
            else{
                next();
                console.log("Ejecuta despues del next");
            }
            
        }
        else{
            token = req.query.apiKey;
            console.log(token);
            if(token){
                if(token != TOKEN){
                    res.statusMessage = "Unathorized access, wrong key";
                    return res.status(401).end();
                }
                else{
                    next();
                }
            }
            else{
                res.statusMessage = "Unathorized access, key is missing";
                return res.status(401).end();
            }
            }
        
    }
    
}

app.use(middleware);

app.get('/bookmarks', (req, res) => {
    Bookmarks
    .getBookmarks()
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        res.statusMessage = "The database is down";
        return res.status(500).end();
    });
})

app.get('/bookmark', (req, res) =>{
    let title = req.query.title;
    if(!title){
        res.statusMessage = "The title parameter is required";
        return res.status(406).end();
    }
    let bookmark = Bookmarks
        .getBookmarkByTitle(title)
        .then(result => {
            if(result.length == 0){
                res.statusMessage = `There's no bookmark with the title ${title}`;
                return res.status(404).end();
            }
            else return res.status(200).json(result); 
        })
        .catch(err =>{
            res.statusMessage = "The database is down";
            return res.status(500).end();
        });
})

app.post('/bookmarks', jsonParser, (req, res) => {
    let id = uuid.v4();
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if(!title || !description || !url || !rating){
        res.statusMessage = "There are parameters missing";
        return res.status(406).end();
    }
    let newBookmark = {
        id: id,
        title: title,
        description: description,
        url: url,
        rating: rating,
    }
    Bookmarks
        .createBookmark(newBookmark)
        .then(result=>{
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "The database is down";
            res.status(500).end();
        })
})

app.delete('/bookmark/:id', (req, res) => {
    let id = req.params.id;
    Bookmarks
        .deleteBookmark(id)
        .then(result => {
            if(result.deletedCount == 0){
                res.statusMessage = `Bookmark with id ${id} not found`;
                return res.status(404).end();
            }
            else return res.status(200).end();
        })
        .catch(err => {
            res.statusMessage = "The database is down";
            res.status(500).end();
        })
})

app.patch('/bookmark/:id', jsonParser, (req, res) => {
    let idParam = req.params.id;
    let idBody = req.body.id;
    if(idParam != idBody){
        res.statusMessage = "The id of the parameter and the id of the body don't match";
        return res.status(409).end();
    }
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;
    if (!title && !description && !url && !rating){
        res.statusMessage = "Missing at least 1 parameter to update";
        return res.status(400).end();
    }
    let newBookmark = {};
    if(title){
        newBookmark["title"] = title;
    }
    if(description){
        newBookmark["description"] = description;
    }
    if(url){
        newBookmark["url"] = url;
    }
    if(rating){
        newBookmark["rating"] = rating;
    }
    Bookmarks
        .patchBookmark(idParam, newBookmark)
        .then(result => {
            if(!result){
                res.statusMessage = `Bookmark with id ${idParam} not found`;
                return res.status(404).end();
            }
            else return res.status(202).json(result);
        })
        .catch(err => {
            res.statusMessage = "The database is down";
            return res.status(500).end();
        })
})