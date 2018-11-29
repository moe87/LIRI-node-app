require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

function moviethis(input) {
	if(input === undefined) {
		input = "Mr. Nobody";
	}
	
	// Then run a request to the OMDB API with the movie specified
	request("http://www.omdbapi.com/?t="+input+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
	  if (!error && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    var json = JSON.parse(body);
	    console.log("Title of the Movie:                    " + json.Title);
	    console.log("Year the movie came out:               " + json.Released);
	    console.log("IMDB Rating of the movie:              " + json.imdbRating);
	    for(var rate in json.Ratings) {
	    	if(rate.Source == 'Rotten Tomatoes') {
	    		console.log("Rotten Tomatoes Rating of the movie:" + rate.Value);
	    	}
	    }
	    console.log("Country where the movie was produced:  " + json.Country);
	    console.log("Language of the movie:                 " + json.Language);
	    console.log("Plot of the movie:                     " + json.Plot);
	    console.log("Actors in the movie:                   " + json.Actors);
	  }
	});
}

function concertthis(input){
	request("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp", function(error, response, body) {
		if(!error && response.statusCode === 200) {
			var json = JSON.parse(body);
			for(var i in json) {
				console.log("Name of the venue:   " + json[i].venue.name);
				console.log("Venue location:      " + json[i].venue.city+", "+json[i].venue.region+", "+json[i].venue.country);
				console.log("Date of the Event:   " + moment(json[i].datetime).format("MM/DD/YYYY"));
			}
		}
	});
}

function spotifythis(input) {
	if(input === undefined) {
		input = "What's my age again";
	}

	spotify.search(
		{type: 'track', query: input},
		function(error, data){
			if(error) {
				return console.log("Error Occurred:" + error);
			}

			var items = data.tracks.items;
			for(var i=0; i<items.length; i++) {
				console.log(i);
				console.log("Artist(s).                             :" + items[i].album.artists[0].name);
				console.log("The song's Name.                       :" + items[i].name);
				console.log("A preview link of the song from Spotify:" + items[i].preview_url);
				console.log("The album that the song is form        :" + items[i].album.name);
				console.log("-------------------------------------------");
			}				
		}
	);
}

function run(cmd, input) {
	if(cmd === 'movie-this') {
		moviethis(input);
	} else if(cmd === 'concert-this') {
		concertthis(input);
	} else if(cmd === 'spotify-this-song') {
		spotifythis(input);
	} else {
		console.log("Unrecognized Command:"+cmd);
	}
}

// concert-this, spotify-this-song, movie-this, do-what-it-says
if(process.argv[2] === 'do-what-it-says') {
	fs.readFile("random.txt", "utf8", function(error, data){
		var dataArray = data.split(",");
		run(dataArray[0], dataArray[1]);
	});
} else {
	run(process.argv[2], process.argv[3]);
}


