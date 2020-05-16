function init(){
    getBookmarks();
    watchGetBookmarks();
    watchPostBookmark();
    watchUpdateBookmark();
    watchDeleteBookmark();
}

init();

function watchDeleteBookmark(){
    let deleteForm = document.querySelector(".deleteForm");

    deleteForm.addEventListener("submit", (event) => {
        event.preventDefault();

        deleteBookmark();
    })
}
function deleteBookmark(){
    let deleteId = document.querySelector("#deleteId");

    let url = `/bookmark/${deleteId.value}`;
    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    }

    fetch(url, settings)
    .then(result => {
        if(result.ok){
            getBookmarks();;
        }
        else throw new Error(result.statusText);
    })
    .catch(err => {
        console.log(err);
        bookmarkList.innerHTML = " ";
        if(err.message == "Not Found"){
            bookmarkList.innerHTML += `<h3>There's no bookmark with the id you entered</h3>`;
        }
        else bookmarkList.innerHTML += `<h2>${err.message}</h2>`;
    })

}

function watchUpdateBookmark(){
    let updateForm = document.querySelector(".updateForm");
    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();

        updateBookmark();
    })
}
function updateBookmark(){
    let updateId = document.querySelector('#updateId');
    let updateTitle = document.querySelector('#updateTitle');
    let updateDesc = document.querySelector('#updateDesc');
    let updateUrl = document.querySelector('#updateUrl');
    let updateRating = document.querySelector('#updateRating');

    let url = `/bookmark/${updateId.value}`;
    console.log(updateId.value);
    let data = {
        id: updateId.value,
        title: updateTitle.value,
        description: updateDesc.value,
        url: updateUrl.value,
        rating: updateRating.value
    }
    let settings = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(url, settings)
    .then(result => {
        if(result.ok){
            getBookmarks();
        }
        else throw new Error(result.statusText);
    })
    .catch(err => {
        console.log(err);
        bookmarkList.innerHTML = " ";
        bookmarkList.innerHTML += `<h2>${err.message}</h2>`;
    })
}

function watchPostBookmark(){
    let postForm = document.querySelector('.postForm');
    postForm.addEventListener("submit", (event) => {
        event.preventDefault();
        postBookmark();
    })

}


function postBookmark(){
    let postTitle = document.querySelector('#postTitle');
    let postDescription = document.querySelector('#postDesc');
    let postUrl = document.querySelector('#postUrl');
    let postRating = document.querySelector('#postRating');

    let url = '/bookmarks';

    let data = {
        title: postTitle.value,
        description: postDescription.value,
        url: postUrl.value,
        rating: postRating.value
    }
    let settings = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(url, settings)
    .then(result => {
        if(isNaN(postRating.value)){
            throw new Error("The rating has to be a number");
        }
        else if(result.ok){
            getBookmarks();
        }
        else throw new Error(result.statusText);
    })
    .catch(err => {
        console.log(err);
        bookmarkList.innerHTML = " ";
        bookmarkList.innerHTML += `<h2>${err.message}</h2>`;
    })
    
}


function watchGetBookmarks(){
    let getForm = document.querySelector('.getForm');

    getForm.addEventListener("submit", (event) =>{
        event.preventDefault();

        getBookmarksByTitle();
    })
}


function getBookmarksByTitle(){
    let title = document.querySelector('#getTitle')
    let url = `/bookmark?title=${title.value}`

    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    }

    fetch(url, settings)
    .then(result => {
        if(result.ok){
            return  result.json();
        }
        throw new Error(result.statusText);
    })
    .then(result => {
        bookmarkList.innerHTML = " ";

        if(result.length > 0){
            for(let i = 0; i < result.length; i++){
                bookmarkList.innerHTML +=
                `
                <div>
                <h2>${result[i].title}</h2>
                <h3>ID: ${result[i].id}</h3>
                <label>${result[i].description}</label><br>
                <h5>${result[i].url}</h5>
                <h4>Rating: ${result[i].rating}</h4>
                </div>
                `
            }
        }
    })
    .catch(err => {
        console.log(err);
        bookmarkList.innerHTML = " ";
        bookmarkList.innerHTML += `<h2>${err.message}</h2>`;
    })
}

function getBookmarks(){
    let url = "/bookmarks";

    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    }

    let bookmarkList = document.querySelector('#bookmarkList');

    fetch(url, settings)
    .then(result => {
        console.log("Se esta ejecutando");
        if(result.ok){
            return  result.json();
        }
        throw new Error(result.statusText);
    })
    .then(result => {
        bookmarkList.innerHTML = " ";

        if(result.length > 0){
            for(let i = 0; i < result.length; i++){
                bookmarkList.innerHTML +=
                `
                <div>
                <h2>${result[i].title}</h2>
                <h3>ID: ${result[i].id}</h3>
                <label>${result[i].description}</label><br>
                <h5>${result[i].url}</h5>
                <h4>Rating: ${result[i].rating}</h4>
                </div>
                `
            }
        }
        else{
            bookmarkList.innerHTML += `<h2>There are no bookmarks on the database</h2>`
        }
    })
    .catch(err => {
        bookmarkList.innerHTML = " ";
        bookmarkList.innerHTML += `<h2>${err.message}</h2>`;
    })

}