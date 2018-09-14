'use strict';

const apiStore = {
    YouTube: {
        URL: `https://www.googleapis.com/youtube/v3/playlistItems`,
        settings: {
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
};

//need to save query selectors as varialbes
//refactor URL for TMDB and functions --> the movieDisplay Function has local URL
//Lightbox in own function?
//add tooltip for poster-images

// youtube api
function getYouTubeApiData(callback){
    $.getJSON(apiStore.YouTube.URL, apiStore.YouTube.settings, callback);
  }

function renderVideoResults(results){
    return `
    <div class="movie-trailer-thumbnail">
      <h3 class="trailer-title">${results.snippet.title}</h3>
      <iframe class="trailer" height="200" width="400" src="https://www.youtube.com/embed/${results.snippet.resourceId.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    `;
  }

function displayYoutubeData(data){
    const results = data.items.map((item) => renderVideoResults(item));
    $('.trailer-content').append(results);
  }

  //TMDB api

function fetch(url, callback){
    $.getJSON(url, apiStore.TMDB.settings, callback)
}  

function getTMDBPlayingData(searchTerm, callback){
       $.getJSON(apiStore.TMDB.URL+`${searchTerm}`, apiStore.TMDB.settings, callback);
   }

function getTMDBSearchResults(searchTerm, callback){
  apiStore.TMDB.settings.query = `${searchTerm}`;
  $.getJSON(apiStore.TMDB.Search_URL, apiStore.TMDB.settings, callback);
}

function getTMDBReccommendationResults(id, callback){
    const URL_SearchId = `${id}/recommendations`;
    $.getJSON(apiStore.TMDB.URL+URL_SearchId, apiStore.TMDB.settings, callback);
  }

function getTMDBMovieDetails(id, callback){
  const URL = `https://api.themoviedb.org/3/movie/${id}`;
  $.getJSON(URL, apiStore.TMDB.settings, callback);
}

  function renderTMDBSearchResults(results){
    return `
      <div class="search-results">
        <h2 class="poster-header">${results.title}</h2>
        <img id=${results.id} class="poster-image" src="https://image.tmdb.org/t/p/w300/${results.poster_path}"/>
        <button id=${results.id} class="js-search-reccommended-button reccommend-button" type="submit">Explore Similar Titles</button>
      </div>
    `;
  }

function renderTMDBResults (results){
    return  `
    <div class="in-theaters-info">
        <h2 class="poster-header">${results.title}</h2>
        <img id=${results.id} class="poster-image" src="https://image.tmdb.org/t/p/w300/${results.poster_path}">
        <p>Release Date: ${results.release_date}</p>
    </div>
    `;
  }

function renderTMDBMovieDetails(results){
  return `
  <div class="movie-details">
    <h3 class="movie-details-header">${results.title}</h3>
    <p><span class="movie-details__bold">Release date:</span> ${results.release_date}</p>
    <p><span class="movie-details__bold">Runtime:</span> ${results.runtime} minutes</p>
    <p><span class="movie-details__bold">TMDB Average Score:</span> ${results.vote_average}</p>
    <p><span class="movie-details__bold">Overview:</span> ${results.overview}</p>
    <button class="exit">Exit</button>
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

function displayMovieDetailsData(data){
  const results = renderTMDBMovieDetails(data);
  $('#lightbox').html(results);
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

  function handleScrollButton(){
      $('.js-scroll-to-content').click(function(e){
          e.preventDefault();
          $('html,body').animate({
              scrollTop: $('.movie-content').offset().top
          }, 800);
      });
  }

  //lightbox
  function handleInformationDisplay(){
    $('.clickable-content').on('click', '.poster-image', function(event){
      event.preventDefault();
      const movieId = $(this).attr('id');
      //Should lightbox appending be own function?
      $('.media-wrapper').append(`<div id="wrapper"></div>`);
      $('#wrapper').fadeIn(function(){
        $('.search-area-wrapper').append(`<div id="lightbox"></div>`);
        $('#lightbox').fadeIn();
        getTMDBMovieDetails(movieId, displayMovieDetailsData);
      });
    });
  }

  function handleExitButton(){
    $('body').on('click', '.exit', function(e){
      e.preventDefault();
      $('#lightbox').fadeOut(function(){
        $('#wrapper').remove();
      });
    })
  }
  
  
$(document).ready(function(){
    getYouTubeApiData(displayYoutubeData);
    getTMDBPlayingData(`now_playing`, displayPlayingData);
    getTMDBReccommendationResults(140607, displayTMDBSearchData);
});

handleScrollButton();
handleNowPlayingSearchButton();
handleSearchMovieButton();
handleReccommendationButton();
handleExitButton();
handleInformationDisplay();