'use strict';

const apiStore = {
    YouTube: {
        URL: `https://www.googleapis.com/youtube/v3/playlistItems`,
        settings: {
            maxResults: 9,
            playlistId: `PLScC8g4bqD47swdFI0NWMS7FPfjE6Nswy`,
            part: 'snippet',
            key: `AIzaSyBG6fsTfidnse58wUOpgcJ9d6PL9QiSMaM`, 
            type: 'playlist',
            order: 'date',
          }
    },
    TMDB: {
        URL: `https://api.themoviedb.org/3/movie`,
        Search_URL: `https://api.themoviedb.org/3/search/movie`,
        settings: 
            {
                api_key: `3d7040cc1b37d8215e343c54c3098fa6`,
                language: 'en-US',
                page: 1,
              }
    },
};

// variables
  const trailerPage = $('.trailer-content');
  const playlistButton = $('.js-playlist-btn');
  const recommendedPage = $('.recommendations-page');
  const inTheatersPage = $('.now-playing-content');
  const lightboxDisplay = $('.lightbox');
  const lightboxWrapper = $('#wrapper');

// youtube api
function getYouTubeApiData(callback){
    $.getJSON(apiStore.YouTube.URL, apiStore.YouTube.settings, callback);
  }

function renderVideoResults(result){
    return `
    <div class="movie-trailer-thumbnail">
      <iframe class="trailer" height="200" width="400" src="https://www.youtube.com/embed/${result.snippet.resourceId.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
      title="${result.snippet.title}" alt="movie trailer" aria-label=${result.snippet.title}></iframe>
    </div>
    `;
  }

function displayYoutubeData(data){
    const videoResults = data.items.map((item) => renderVideoResults(item));
    trailerPage.html(videoResults);
  }

function handleYouTubePlaylistButton(){
  playlistButton.click(function(e){
    e.preventDefault();
    const playlistId = $(this).attr('id')
    apiStore.YouTube.settings.playlistId = `${playlistId}`;
    getYouTubeApiData(displayYoutubeData);
  })
}

function fetch(url, callback){
    $.getJSON(url, apiStore.TMDB.settings, callback)
}  

  function renderTMDBSearchResults(result){
    const {title, id, poster_path} = result;
    return `
      <div class="search-results">
        <h2 class="poster-header">${title}</h2>
        <a href="#" id="${id}" title="Click for more info"><img class="poster-image" src="https://image.tmdb.org/t/p/w300/${poster_path}" alt="poster ${title}"/></a>
        <button id="movie${id}" class="js-search-recommended-button recommend-button" type="submit">View Similar Titles</button>
      </div>
    `;
  }

function renderTMDBResults (result){
  const {title, id, release_date, poster_path} = result;
    return  `
    <div class="in-theaters-info">
        <h2 class="poster-header">${title}</h2>
        <a href="#" id="${id}" title="click for more info"><img class="poster-image" src="https://image.tmdb.org/t/p/w300/${poster_path}" alt="poster ${title}"></a>
    </div>
    `;
  }

function renderTMDBMovieDetails(result){
  const {title, vote_average, runtime, release_date, overview} = result
  return `
  <div class="movie-details">
    <h3 class="movie-details-header" tabindex="0">${title}</h3>
    <p><span class="movie-details__bold">Release date:</span> ${release_date}</p>
    <p><span class="movie-details__bold">Runtime:</span> ${runtime} minutes</p>
    <p><span class="movie-details__bold">TMDB Average Score:</span> ${vote_average}</p>
    <p><span class="movie-details__bold">Overview:</span> ${overview}</p>
    <button class="exit-btn" aria-label="press esc button to exit">Exit (esc)</button>
  </div>
  `;
}

  function displayTMDBSearchData(data){
    const searchResults = data.results.map((item, index)=> 
        renderTMDBSearchResults(item));
        recommendedPage.html(searchResults);
  }

  function displayPlayingData(data){
      const newReleaseResults = data.results.map((item)=> renderTMDBResults(item)).sort();
      inTheatersPage.html(newReleaseResults);
  }

function displayMovieDetailsData(data){
  const results = renderTMDBMovieDetails(data);
  $('.lightbox').html(results);
}

  function handleNowPlayingSearchButton(){
      $('.now-playing-form').submit(function(e){
          e.preventDefault();
          const queryTarget = $(this).find('.userInput');
          const query = queryTarget.val();
          fetch(`${apiStore.TMDB.URL}/${query}`, displayPlayingData);
      })
  }

  function handleSearchMovieButton(){
    $('.js-search-form').submit(function(e){
      e.preventDefault();
      const queryTarget = $(this).find('.js-searchBar');
      const query = queryTarget.val();
      queryTarget.val('');
      apiStore.TMDB.settings.query = query;
      fetch(apiStore.TMDB.Search_URL, displayTMDBSearchData);
    });
  }
  
  function handlerecommendationButton(){
    recommendedPage.on('click', '.js-search-recommended-button', function(e){
      e.preventDefault();
      const movieId = $(this).attr('id').match(/\d+/g).join('');
      fetch(`${apiStore.TMDB.URL}/${movieId}/recommendations`, displayTMDBSearchData);
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

  function handleInformationDisplay(){
    $('.clickable-content').on('click', 'a', function(event){
      event.preventDefault();
      const movieId = $(this).attr('id');
      $('.media-wrapper').append(`<div id="wrapper"></div>`);
      $('#wrapper').fadeIn(function(){
        $('.search-area-wrapper').append(`<div class="lightbox" aria-live="assertive"></div>`);
        $('.lightbox').fadeIn();
        fetch(`https://api.themoviedb.org/3/movie/${movieId}`, displayMovieDetailsData);
      });
    });
  }

  function handleExitButton(){
    $('body').on('click', '.exit-btn', function(e){
      e.preventDefault();
      $('.lightbox').fadeOut(function(){
        $('#wrapper').remove();
      });
    });
  }

function handleLightboxEscButton(){
  $('body').keyup(function(e){
    if (e.which == 27) {
      $('.lightbox').fadeOut(function(){
        $('#wrapper').remove()});
    }
  });
}
  
$(document).ready(function(){
    getYouTubeApiData(displayYoutubeData);
    fetch(`${apiStore.TMDB.URL}/now_playing`, displayPlayingData);
    fetch(`${apiStore.TMDB.URL}/140607/recommendations`, displayTMDBSearchData);
});

handleYouTubePlaylistButton();
handleScrollButton();
handleNowPlayingSearchButton();
handleSearchMovieButton();
handlerecommendationButton();
handleExitButton();
handleInformationDisplay();
handleLightboxEscButton();