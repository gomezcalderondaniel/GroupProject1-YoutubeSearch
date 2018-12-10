// Initialize Firebase
var config = {
    apiKey: "AIzaSyBq9g0wIZE9mw5II9BXZEouUvuKGOWbIK8",
    authDomain: "moodlist-6736e.firebaseapp.com",
    databaseURL: "https://moodlist-6736e.firebaseio.com",
    projectId: "moodlist-6736e",
    storageBucket: "moodlist-6736e.appspot.com",
    messagingSenderId: "224635158925"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

const app = {};
var capturedPhoto;

app.getArists = (artist) => $.ajax({
	url: 'https://api.spotify.com/v1/search',
	method: 'GET',
	dataType: 'json',
	data: {
		type: 'artist',
		q: artist
	}
});

app.getAristsAlbums = (id) => $.ajax({
	url: `https://api.spotify.com/v1/artists/${id}/albums`,
	method: 'GET',
	dataType: 'json',
	data: {
		album_type: 'album',
	}
});

app.getAlbumTracks = (id) => $.ajax({
	url: `https://api.spotify.com/v1/albums/${id}/tracks`,
	method: 'GET',
	dataType: 'json'
});

app.getAlbums = function(artists) {
	let albums = artists.map(artist => app.getAristsAlbums(artist.id));
	$.when(...albums)
		.then((...albums) => {
			let albumIds = albums
				.map(a => a[0].items)
				.reduce((prev,curr) => [...prev,...curr] ,[])
				.map(album => app.getAlbumTracks(album.id));

			app.getTracks(albumIds);
		});
};

app.getTracks = function(tracks) {
	$.when(...tracks)
		.then((...tracks) => {
			tracks = tracks
				.map(getDataObject)
				.reduce((prev,curr) => [...prev,...curr],[]);	
			const randomPlayList = getRandomTracks(50,tracks);
			app.createPlayList(randomPlayList);
		})
};

app.createPlayList = function(songs) {
	const baseUrl = 'https://embed.spotify.com/?theme=white&uri=spotify:trackset:My Playlist:';
	songs = songs.map(song => song.id).join(',');
	$('.loader').removeClass('show');
	$('.playlist').append(`<iframe src="${baseUrl + songs}" height="400"></iframe>`);
}

var moodSelect = "";

app.init = function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		let artists = $('input[type=search]').val();
		$('.loader').addClass('show');
		artists = artists
			.split(',')
			.map(app.getArists);
		
		$.when(...artists)
			.then((...artists) => {
				artists = artists.map(a => a[0].artists.items[0]);
				console.log(artists);
				app.getAlbums(artists);
			});
        
            var clientId = '1182c78c1d1640bdb11753b2a466f09b';
            var clientSecret = 'cb0c0bcae4fb45dead4532baaa701f27';
            moodSelect = $("input[type=search]").val().toLowerCase();
            var token = 'BQCdkUZ1SzYd_o9N65bPWwoZoHqIblePk-exQbzxwJqXVVgxRLUaHqSnGnoreq9A283LXA8usZfV1d8EYG6thKLVIyRyTDsdNWX29kVUDIk43GZLB4ghJEVap72jDyGcbkixbyc6m-yA2IxNK7JuaqP1';
            var queryURL = 'https://api.spotify.com/v1/search?type=playlist&q=' + moodSelect + '&access_token=' + token;       
            
            $.ajax({
                url: queryURL,
                method:'GET'
            }).then(function(response){
                console.log("mood:" + moodSelect);
                console.log(response);
                var embedCode = '<iframe  src="https://open.spotify.com/embed/playlist/' + response.playlists.items[0].id + '" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media" class="z-depth-5"></iframe>';
                $('.playlist').html(embedCode);
          })

	});

const appKey = "be4c40d5907c398252e381e788c398ff";

let searchButton = document.getElementById("search-btn");
let searchInput = document.getElementById("search-txt");
let cityName = document.getElementById("city-name");
let icon = document.getElementById("icon");
let temperature = document.getElementById("temp");
let humidity = document.getElementById("humidity-div");
let temp2 = "";

searchButton.addEventListener("click", findWeatherDetails);
searchInput.addEventListener("keyup", enterPressed);

function enterPressed(event) {
  if (event.key === "Enter") {
	findWeatherDetails();
  }
}

function findWeatherDetails() {
  if (searchInput.value === "") {
  
  }else {
    let searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput.value + "&appid="+ appKey;
   httpRequestAsync(searchLink, theResponse);
  }
 }

function theResponse(response) {
  let jsonObject = JSON.parse(response);
  cityName.innerHTML = jsonObject.name;
  icon.src = "http://openweathermap.org/img/w/" + jsonObject.weather[0].icon + ".png";
  temperature.innerHTML = parseInt((jsonObject.main.temp - 273) * 9/5) + 32  + "°";
  humidity.innerHTML = jsonObject.main.humidity + "%";
console.log(temperature);

temp2 = temperature.innerHTML;

  database.ref('/mood-weather').push({
	moodSelect: moodSelect,
	temperature: temp2
});
  
}

function httpRequestAsync(url, callback)
{
  console.log("hello");
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => { 
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }
    httpRequest.open("GET", url, true); // true for asynchronous 
    httpRequest.send();
}

}


const getDataObject = arr => arr[0].items;

function getRandomTracks(num, tracks) {
	const randomResults = [];
	for(let i = 0; i < num; i++) {
		randomResults.push(tracks[ Math.floor(Math.random() * tracks.length) ])
	}
	return randomResults;
}

$(app.init);

$('#table').hide();
$('#hide-previous-moods').hide();

$('form').on('submit', function() {
	anime({
		targets: '.playlist',
		translateX: [
			{value: 100, duration: 500},
			{value: 0, duration: 1000}
		],
		easing: 'easeInBack'
	 });
	});


$('#previous-moods').on('click', function() {
    $('#previous-moods').hide();
    $('#hide-previous-moods').show();
    $('table').show();
    anime({
        targets: 'table',
        translateX: 0,
        rotate: '1turn', 
        duration: 700
      });
})
$('#hide-previous-moods').on('click', function() {
    $('#hide-previous-moods').hide();
    $('#previous-moods').show();
    $('table').hide();
})

database.ref('/mood-weather').on("child_added", function(snapshot) {
    var newMood = snapshot.val().moodSelect;
    var newWeather = snapshot.val().temperature;

    var newRow = $('<tr>').append(
		$('<td>').text(newMood.charAt(0).toUpperCase() + newMood.slice(1).toLowerCase()),
		$('<td>').text(newWeather)
    );
    $('#table').append(newRow);
}, function(errorObject) {
	console.log("Errors handled " + errorObject.code);
});
