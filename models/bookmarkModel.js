const mongoose = require('mongoose');

const bookmarksSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    }
});

const bookmarksCollection = mongoose.model('bookmarks', bookmarksSchema);

const Bookmarks = {
    createBookmark: function(newBookmark){
        return bookmarksCollection
            .create(newBookmark)
            .then(createdBookmark =>{
                return createdBookmark;
            })
            .catch(err =>{
                return err;
            });
    },
    getBookmarks: function(){
        return bookmarksCollection
            .find()
            .then(result =>{
                return result;
            })
            .catch(err=>{
                return err;
            });
    },
    getBookmarkByTitle: function(bookmarkTitle){
        return bookmarksCollection
            .find({title: bookmarkTitle})
            .then(result=>{
                return result;
            })
            .catch(err =>{
                return err;
            });
    },
    deleteBookmark: function(bookmarkId){
        return bookmarksCollection
            .remove({id: bookmarkId})
            .then(result =>{
                return result;
            })
            .catch(err => {
                return err;
            });
    },
    patchBookmark: function(bookmarkId, values){
        return bookmarksCollection
            .findOneAndUpdate({id: bookmarkId}, {$set: values}, {new: true})
            .then(result =>{
                return  result;
            })
            .catch(err =>{
                return err;
            });
    }
}

module.exports = {Bookmarks};