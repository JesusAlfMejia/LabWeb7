const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const uuid = require('uuid');

app.use(morgan('dev'));

app.listen(8080, () => {
    console.log("This server is running on port 8080");
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

let bookmarksList = [
    {
        id: uuid.v4(),
        title: "Moby Dick",
        description: "A book about a whale",
        url: "www.mobydick.com",
        rating: 4
    },{
        id: uuid.v4(),
        title: "Spiderman",
        description: "A book about a spider",
        url: "www.spiderman.com",
        rating: 5
    },
    {
        id: uuid.v4(),
        title: "Hunger Games",
        description: "A book about hunger",
        url: "www.hungergames.com",
        rating: 3
    }
]

app.get('/bookmarks', (req, res) => {
    return res.status(200).json(bookmarksList);
})

app.get('/bookmark', (req, res) =>{
    let title = req.query.title;
    if(!title){
        res.statusMessage = "The title parameter is required";
        return res.status(406).end();
    }
    let bookmark = [];
    for(let i=0; i<bookmarksList.length; i++){
        if(title == bookmarksList[i].title){
            bookmark.push(bookmarksList[i]);
        }
    }
    if(bookmark.length == 0){
        res.statusMessage = `There's no bookmark with the title ${title}`;
        return res.status(404).end();
    }
    
    return res.status(200).json(bookmark);
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
    bookmarksList.push(newBookmark);
    return res.status(201).json(newBookmark);
})

app.delete('/bookmark/:id', (req, res) => {
    let id = req.params.id;
    let bookmarkIndex = bookmarksList.findIndex((bookmark) =>{
        if(id == bookmark.id){
            return true;
        }
    });
    if(bookmarkIndex != -1){
        bookmarksList.splice(bookmarkIndex, 1);
        return res.status(200).end();
    }
    else{
        res.statusMessage = `Bookmark with id ${id} not found`;
        return res.status(404).end();
    }
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
    let bookmarkIndex = bookmarksList.findIndex((bookmark) =>{
        if(bookmark.id == idParam){
            return true;
        }
    });
    if(bookmarkIndex == -1){
        res.statusMessage = `Bookmark with id ${idParam} not found`;
        return res.status(404).end();
    }
    let newBookmark = bookmarksList[bookmarkIndex];
    if(title){
        newBookmark.title = title;
    }
    if(description){
        newBookmark.description = description;
    }
    if(url){
        newBookmark.url = url;
    }
    if(rating){
        newBookmark.rating = rating;
    }
    bookmarksList[bookmarkIndex] = newBookmark;
    return  res.status(202).json(newBookmark);
})