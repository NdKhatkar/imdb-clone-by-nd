const API_KEY = "api_key=bb5be8b07032cb792918029290546e10";
const Base_Url = "https://api.themoviedb.org/3/";
let searchUrl = 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=bb5be8b07032cb792918029290546e10'
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const  resultContainer = document.getElementById('result-container');
const searchList = document.getElementById('search-list');
const movieSearchBox = document.getElementById('movie-search-box');
const SearchButton = document.getElementById('SearchButton');
const searchIcon =document.getElementById('searchIcon');

SearchButton.addEventListener("click", findMovies())

function findMovies() {

    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchIcon.setAttribute("href","searchResults.html?id="+searchTerm);
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}



async function loadMovies(searchTerm) {
    console.log("here im  "+searchTerm);
    let URL = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=bb5be8b07032cb792918029290546e10`;

    fetch(URL).then(response => response.json()).then(data => {
        displayMovieList(data.results);
    })
}

function displayMovieList(movies) {
    searchList.innerHTML = ""; 
    for (let idx = 0; idx < movies.length; idx++) {
        console.log("inside loop");
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].id; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        let moviePoster="imageNotFound.png";
        if (movies[idx].poster_path != null)
            moviePoster = IMG_URL+movies[idx].poster_path;
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


async function getMovieDetailsById(imdbID) {
    console.log("inside getmovies details");
    const response = await fetch(`https://api.themoviedb.org/3/movie/${imdbID}?api_key=bb5be8b07032cb792918029290546e10`);
    const data = await response.json();
    return  data;
}

function displayMovieDetails(movie) {

    let genre ="N/A";
    const genres=movie.genres;
    console.log(genres);

    genres.forEach((value) => {
        if(genre==="N/A")
        {
            genre=value.name;
        }else {
           genre=value.name+" , "+genre; 
        }
        
    }  )

    let moviePoster="imageNotFound.png";
        if (movie.poster_path != null)
        {
            moviePoster = IMG_URL+movie.poster_path;
        }
        else{
            moviePoster = "imageNotFound.png";
        }
    
    resultContainer.innerHTML = `
    <div class="result-grid">
    <div class="movie-poster">
    <div id="addToBookmark" ><i  class="material-icons addToBookmarkicons" data-id="${movie.id}" >favorite</i></div>
         <img src="${moviePoster}" alt=""> 
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="rated">IMDb Rating : ${movie.vote_average}</p>
        <p class="released">released : ${movie.release_date}</p>
        <p class="genre"><b>Genre :</b> ${genre}</p>
        <p class="writer"><b>Writer :</b> N/A </p>
        <p class="actors"><b>Actors :</b> N/A</p>
        <p class="plot"> <b>Duration :</b> ${movie.runtime} minutes</p>
        <p class="language"><b>Language :</b> ${movie.original_language}</p>
        <p class="awards"><b><i class="awardID">Status : </i></b> ${movie.status}</p>
        <br />
        <span class="overview"><b>Overview</b> : ${movie.overview}</span>
    </div>
</div>
    `;

    const favouriteButtons = document.querySelectorAll('.addToBookmarkicons');
        favouriteButtons.forEach(button => {
            button.addEventListener('click', addToFavourites);
        });

}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=bb5be8b07032cb792918029290546e10`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('id');

    if (imdbID) {
        getMovieDetailsById(imdbID)
            .then(movie => {
                console.log(movie);
                if (movie) {
                    console.log("about to call display function");
                    displayMovieDetails(movie);
                } else {
                    console.log("about to call display function");
                    resultContainer.innerHTML = '<p>Movie details not found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                resultContainer.innerHTML = '<p>Error fetching movie details.</p>';
            });
    }
});

// Function to add a movie to favourites
async function addToFavourites(event) {
    console.log(event.target.dataset.id);
    const imdbID = event.target.dataset.id;
    const movie =await  getMovieDetailsById(imdbID);
    console.log(movie.title);
    if (movie) {
        const favouritesList = JSON.parse(localStorage.getItem('favourites')) || [];
        if (!favouritesList.some(m => m.id === movie.id)) {
            favouritesList.push(movie);
            localStorage.setItem('favourites', JSON.stringify(favouritesList));
            alert(`${movie.title} has been added to your favourites!`);
        } else {
            alert(`${movie.title} is already in your favourites!`);
        }
    }
}