
let pageIndex = 1;
const API_KEY = "api_key=bb5be8b07032cb792918029290546e10";
const Base_Url = "https://api.themoviedb.org/3/";
let searchUrl = 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=bb5be8b07032cb792918029290546e10'
let popularMoviesurl = Base_Url + '/discover/movie?include_adult=true&include_video=true&language=en-US&page=' + pageIndex + '&sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';


const trandingMovies = document.querySelector('.trandingMovies');
const showmoreBotton = document.getElementById('showmore');
const searchList = document.getElementById('search-list');
const movieSearchBox = document.getElementById('movie-search-box');
const SearchButton = document.getElementById('SearchButton');
const searchIcon = document.getElementById('searchIcon');

function getMovies(url) {
    fetch(url).then(response => response.json()).then(data => {
        console.log(data);
        showMovies(data.results);
    })
}

getMovies(popularMoviesurl);


function showMovies(data) {
    data.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.dataset.id = movie.id; 

        let moviePoster="imageNotFound.png";
        if (movie.poster_path != null)
            moviePoster = IMG_URL+movie.poster_path;
        else
            moviePoster = "imageNotFound.png";


        movieElement.innerHTML = `

                <div id="addToBookmarkdiv" ><i class="material-icons addToBookmark" data-id="${movie.id}">favorite</i></div>
                <a href="MovieData.html?id=${movie.id}"
                <div class="movieBox" data-imdbid="${movie.id}">
                
                <div class="movie-poster">
                    <img src="${moviePoster}" alt="">
                    
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="Year"><b>Released on :</b>${movie.release_date}</p>
                    <p class="rating"><b>Rating :</b>${movie.vote_average}</p>                    
                    <p class="genre"><b>Genre :</b>${movie.genre_ids}</p>
                    <p class="language"><b>Language :</b> ${movie.original_language}</p>
                </div>
                </div>
                </a>`


        trandingMovies.appendChild(movieElement);

        const favouriteButtons = document.querySelectorAll('.addToBookmark');
        favouriteButtons.forEach(button => {
            button.addEventListener('click', addToFavourites);
        });

    });
}

showmoreBotton.addEventListener("click", () => {
    pageIndex++;
    console.log(pageIndex);
    popularMoviesurl = Base_Url + '/discover/movie?include_adult=true&include_video=true&language=en-US&page=' + pageIndex + '&sort_by=popularity.desc&' + API_KEY;
    getMovies(popularMoviesurl);
});

//here we are operating our searchbar

SearchButton.addEventListener("click", () => {

})

function findMovies() {

    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchIcon.setAttribute("href", "searchResults.html?id=" + searchTerm);
        console.log(searchIcon.getAttribute("href"));
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

async function loadMovies(searchTerm) {
    const URL = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=bb5be8b07032cb792918029290546e10`;

    fetch(URL).then(response => response.json()).then(data => {
        displayMovieList(data.results);
    })
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].id; // setting movie id in  data-id
        movieListItem.classList.add('item-containerIn-search');
        let moviePoster = "imageNotFound.png";
        if (movies[idx].poster_path != null)
            moviePoster = IMG_URL + movies[idx].poster_path;
        else
            moviePoster = "imageNotFound.png";

        movieListItem.innerHTML = `
        <a href="MovieData.html?id=${movies[idx].id}"
        <div class="search-list-item">
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <p>${movies[idx].title}</p>
            <p>${movies[idx].release_date}</p>
        </div>
        </div>
        </a>
        `;
        searchList.appendChild(movieListItem);
    }
}



window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});


// Function to add a movie to favourites
async function addToFavourites(event) {
    const imdbID = event.target.dataset.id;
    const movie =await  getMovieDetailsById(imdbID);
    if (movie) {
        const favouritesList = JSON.parse(localStorage.getItem('favourites')) || [];
        console.log(favouritesList);
        if (!favouritesList.some(m => m.id === movie.id)) {
            favouritesList.push(movie);
            localStorage.setItem('favourites', JSON.stringify(favouritesList));
            alert(`${movie.title} has been added to your favourites!`);
        } else {
            alert(`${movie.title} is already in your favourites!`);
        }
    }
}

async function getMovieDetailsById(imdbID) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${imdbID}?api_key=bb5be8b07032cb792918029290546e10`);
    const data = await response.json();
    return data;
}