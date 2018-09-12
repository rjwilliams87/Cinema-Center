'use strict';

const state = {
    YouTube: {
        URL: `https://www.googleapis.com/youtube/v3/playlistItems`,
        settings: {
            //channedId: 'UCi8e0iOVk1fEOogdfu4YgfA',
            maxResults: 10,
            playlistId: `PLScC8g4bqD47swdFI0NWMS7FPfjE6Nswy`,
            part: 'snippet',
            key: `AIzaSyBG6fsTfidnse58wUOpgcJ9d6PL9QiSMaM`, 
            type: 'playlist',
            order: 'date',
          }
    },
    TMDB: {
        URL: `https://api.themoviedb.org/3/movie/`,
        Search_URL: `https://api.themoviedb.org/3/search/movie`,
        settings: 
            {
                api_key: `3d7040cc1b37d8215e343c54c3098fa6`,
                language: 'en-US',
                page: 1,
              }
    },
    News: {
        URL: `https://newsapi.org/v2/everything`,
        api_key: `6075e1b5ab43474aaeb5bd5bc6f0b466`,
    }
};

$(document).ready(function(){
    getYouTubeApiData(displayYoutubeData);
    getTMDBPlayingData(`now_playing`, displayPlayingData);
    getTMDBReccommendationResults(205, displayTMDBSearchData);
});

// youtube api

function getYouTubeApiData(callback){
    $.getJSON(state.YouTube.URL, state.YouTube.settings, callback);
  }

function renderVideoResults(results){
    return `
    <div class="movie-trailer-thumbnail">
      <h3 class="trailer-title">${results.snippet.title}</h3>
      <iframe width="400" height="200" src="https://www.youtube.com/embed/${results.snippet.resourceId.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    `;
  }

function displayYoutubeData(data){
    const results = data.items.map((item) => renderVideoResults(item));
    $('.trailer-content').append(results);
  }

  //TMDB api
function getTMDBPlayingData(searchTerm, callback){
       $.getJSON(state.TMDB.URL+`${searchTerm}`, state.TMDB.settings, callback);
   }

function getTMDBSearchResults(searchTerm, callback){
  state.TMDB.settings.query = `${searchTerm}`;
  $.getJSON(state.TMDB.Search_URL, state.TMDB.settings, callback);
}

function getTMDBReccommendationResults(id, callback){
    const URL_SearchId = `${id}/recommendations`;
    $.getJSON(state.TMDB.URL+URL_SearchId, state.TMDB.settings, callback);
  }

  function renderTMDBSearchResults(results){
    return `
      <div class="search-results">
        <h2>${results.title}</h2>
        <img class="poster-image" src="https://image.tmdb.org/t/p/w300/${results.poster_path}"/>
        <button id=${results.id} class="js-search-reccommended-button reccommend-button" type="submit">Search Reccommendations</button>
      </div>
    `;
  }

function renderTMDBResults (results){
    return  `
    <div class="in-theaters-info">
        <a class="movie-details" href="#">
        <h2>${results.title}</h2>
        <img class="poster-image" src="https://image.tmdb.org/t/p/w300/${results.poster_path}">
        </a>
        <p>Release Date: ${results.release_date}</p>
    </div>
    `;
  }

  function displayTMDBSearchData(data){
    let dataArray = [];
    for (let i = 0; i < 6; i++){
      if (data.results[i]){
      dataArray.push(data.results[i]);
      }
    }
    const searchResults = dataArray.map((item)=> renderTMDBSearchResults(item)).join('');
    $('.reccommendations-page').html(searchResults);
  }

  function displayPlayingData(data){
      const results = data.results.map((item)=> renderTMDBResults(item));
      $('.now-playing-content').html(results);
  }

  function handleNowPlayingSearchButton(){
      $('.now-playing-form').submit(function(e){
          e.preventDefault();
          const queryTarget = $(this).find('.userInput');
          const query = queryTarget.val();
          getTMDBPlayingData(query, displayPlayingData);
      })
  }

  function handleSearchMovieButton(){
    $('.js-search-form').submit(function(e){
      e.preventDefault();
      const queryTarget = $(this).find('.js-searchBar');
      const query = queryTarget.val();
      queryTarget.val('');
      getTMDBSearchResults(query, displayTMDBSearchData);
    });
  }
  
  function handleReccommendationButton(){
    $('.reccommendations-page').on('click', '.js-search-reccommended-button', function(e){
      e.preventDefault();
      const movieId = $(this).attr('id');
      getTMDBReccommendationResults(movieId, displayTMDBSearchData);
    })
  }

  function handleDisplayContentButton(){
      $('.js-display-content-button').click(function(e){
          e.preventDefault();
      })
  }

  handleDisplayContentButton();
  handleNowPlayingSearchButton();
  handleSearchMovieButton();
  handleReccommendationButton();
