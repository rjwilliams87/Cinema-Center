'use strict';

const state = {
    YouTube: {
        URL: `https://www.googleapis.com/youtube/v3/search`,
        api_key: `AIzaSyBG6fsTfidnse58wUOpgcJ9d6PL9QiSMaM`,
    },
    TMDB: {
        URL: `https://api.themoviedb.org/3/movie/now_playing`,
        api_key: `3d7040cc1b37d8215e343c54c3098fa6`,
    },
    News: {
        URL: `https://newsapi.org/v2/everything`,
        api_key: `6075e1b5ab43474aaeb5bd5bc6f0b466`,
    }
};

// youtube api

function getYouTubeApiData(callback){
    const query = {
      //channedId: 'UCi8e0iOVk1fEOogdfu4YgfA',
      maxResults: 10,
      part: 'snippet',
      key: state.YouTube.api_key, 
      type: 'video',
      order: 'date',
      q: 'movieclips trailer'
    }
  
    $.getJSON(state.YouTube.URL, query, callback);
  }

function renderVideoResults(results){
    return `
    <div class="movie-trailer-thumbnail">
      <h3 class="trailer-title">${results.snippet.title}</h3>
      <img src="${results.snippet.thumbnails.medium.url}">
    </div>
    `;
  }

function displayYoutubeData(data){
    const results = data.items.map((item) => renderVideoResults(item));
  
    $('.trailer-content').append(results);
  }

  //TMDB api
let TMDB_URL; 

function getTMDBData (callback){
    const query = {
      api_key: state.TMDB.api_key, 
      language: 'en-US',
      page: 1
    }
    $.getJSON(state.TMDB.URL, query, callback);
   }

function getTMDBPlayingData(callback){
       const query = {
           api_key: state.TMDB.api_key,
           language: 'en-US',
           page: 1
       }
       $.getJSON(TMDB_URL, query, callback);
   }

const TMDB_API_KEY ='3d7040cc1b37d8215e343c54c3098fa6';
let TMDB_Search_URL = `https://api.themoviedb.org/3/search/movie`;

function getTMDBSearchResults(searchTerm, callback){
  const settings = {
    api_key: TMDB_API_KEY,
    query: `${searchTerm}`,
    language: 'en-US',
    page: 1
  }
  $.getJSON(TMDB_Search_URL, settings, callback);
}

function getTMDBReccommendationResults(id, callback){
    let URL = `https://api.themoviedb.org/3/movie/${id}/recommendations`
    const query = {
      api_key: TMDB_API_KEY,
      language: 'en-US',
      page: 1
    }
    $.getJSON(URL, query, callback);
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

  function renderTMDBReccomendedResults(results){
    return `
    <div class="reccomend-results">
      <h2>${results.title}</h2>
      <img class="poster-image" src="https://image.tmdb.org/t/p/w300/${results.poster_path}"/>
    </div>
    `;
  }

function renderTMDBResults (results){
    return  `
    <div class="in-theaters-info">
        <a class="movie-details" href="#">
        <h2>${results.title}</h2>
        <img src="https://image.tmdb.org/t/p/w300/${results.poster_path}">
        </a>
        <p>Release Date: ${results.release_date}</p>
    </div>
    `;
  }

  function displayTMDBSearchData(data){
    //const searchResults = data.results.map((item)=> 
    //renderTMDBSearchResults(item)).join('');
  
    let dataArray = [];
    for (let i = 0; i < 3; i++){
      if (data.results[i]){
      dataArray.push(data.results[i]);
      }
    }
  
    const searchResults = dataArray.map((item)=> renderTMDBSearchResults(item)).join('');
  
    //console.log(data);
    //console.log(dataArray);
  
    $('.reccommendations-page').html(searchResults);
  }
  
  function displayTMDBReccommendationData(data){
    const reccommendedResults = data.results.map((item)=> renderTMDBReccomendedResults(item)).join('');
  
    $('.reccommendations-page').html(reccommendedResults);
  }

  function displayTMDBData (data){
    const results = data.results.map((item)=> renderTMDBResults(item));
  
    $('.now-playing-content').append(results);
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

          if (query === 'upcoming'){
            TMDB_URL =  `https://api.themoviedb.org/3/movie/upcoming`;
          }else if (query === 'now_playing'){
            TMDB_URL = `https://api.themoviedb.org/3/movie/now_playing`;
          }else if (query === 'popular'){
            TMDB_URL=`https://api.themoviedb.org/3/movie/popular`;
          }
          getTMDBPlayingData(displayPlayingData);
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
      //console.log(movieId);
  
      getTMDBReccommendationResults(movieId, displayTMDBReccommendationData);
    })
  }

  function handleDisplayContentButton(){
    $('.js-display-content-button').click(function(e){
        e.preventDefault();
        $('main').prop('hidden', false);

        getYouTubeApiData(displayYoutubeData);
        getTMDBData(displayTMDBData);
    });
  }

  handleDisplayContentButton();
  handleNowPlayingSearchButton();
  handleSearchMovieButton();
  handleReccommendationButton();
