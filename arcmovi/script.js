let btn = document.querySelector("body");
let toggleMenu = document.querySelector(".toggle");
var container = document.getElementsByClassName("container");
let searchform = document.getElementById("searchForm");
let i = 1;
let api_key = "e5391c1a8808501be6c2e56da9f07b03";
let url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${i}`;
const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=`;
fetchData(url);

toggleMenu.addEventListener("click", () => {
  console.log("clicked");
  let ul = document.querySelector(".bottomHeader");
  ul.classList.toggle("show");
  toggleMenu.classList.toggle("fa-xmark");
  ul.classList.add("bg");
});
// lazy loading function.
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  // Check if the user has scrolled to the bottom of the page
  if (scrollTop + clientHeight >= scrollHeight - 2) {
    // Fetch more data when reaching the bottom
    fetchData();
  }
});
function fetchData() {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        i++;
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
        console.log(Error(message));
      }
      return response.json();
    })
    .then((movies) => {
      let container = document.querySelector(".container");
      let myLen = movies.results.length;

      showMovies();
      showTrendingMovies(movies);

      function showMovies() {
        for (var j = 0; j < myLen; j++) {
          let movie = movies.results[j];
          container.innerHTML += `<div class="box">
          <img data-movie-id=${movie.id} src="http://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="img" />
              <div class="moviesDetails">
               <div class="leftDetails">
                   <h5>${movie.original_title}</h5>
                   <p>${movie.release_date}</p>
                 </div>
                   <div class="rightDetails rating">${movie.vote_average}</div>
                 </div>
            </div>`;
        }
      }
      const movieImages = document.querySelectorAll(".box img");
      movieImages.forEach((img) => {
        img.addEventListener("click", () => {
          const movieId = img.getAttribute("data-movie-id"); // Get the movieId from the attribute
          showMovieDetails(movieId);
        });
        function showMovieDetails(movieId) {
          window.location.href = `movieDetail.html?id=${movieId}`;
        }
      });
    })
    .catch((error) => {
      error.message;
      console.log(error);
    });
}
function showTrendingMovies(movies) {
  const sortedMovies = movies.results.sort(
    (a, b) => b.popularity - a.popularity
  );
  const carouselInner = document.getElementById("movieCarousel");
  const top3TrendingMovies = sortedMovies.slice(0, 3);
  carouselInner.innerHTML = "";
  for (let j = 0; j < top3TrendingMovies.length; j++) {
    const movie = top3TrendingMovies[j];
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (j === 0) {
      carouselItem.classList.add("active");
    }
    carouselItem.innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}">    
        <div class="carousel-caption d-none d-md-block">
          <h1>${movie.original_title}</h1>
          <h5>${movie.release_date}</h5>
          <h5>${movie.vote_average}</h5>
        </div>`;
    carouselInner.appendChild(carouselItem);
  }
}
searchform.addEventListener("click", (event) => {
  event.preventDefault();
  const movieSearch = document.getElementById("searchInput");
  const searchTerm = movieSearch.value.trim();
  if (searchTerm) {
    const searchQuery = searchURL + encodeURIComponent(searchTerm);
    fetchData(searchQuery); // Use the searchQuery URL for fetching search results
   }
});
