var request = require('request');
var sync = require('synchronize');
var _ = require('underscore');

module.exports = function(req, res){

  var term = req.query.text.trim();

  if (!term) {
    res.json([{
      title: '<i>Enter a song title!</i>',
      text: ''
    }]);
    return;
  }

  var response;
  try{
    response = sync.await(request({
      url: 'https://api.spotify.com/v1/search',
      qs: {
        q: term,
        limit: 15,
        type: 'track'
      },
      json: true
    }, sync.defer()));
  } catch(e) {
    //it'd be interesting to have an logging tool saving the error message
    //plus information about what led to it (query string)
    //right now it is being lost, but I reckon we should at least tell the user
    res.status(500).json([{
      title: 'Results not found due to a server error!',
      text: ''
    }]);
    return;
  }

  if (response.statusCode !== 200 || !response.body) {
    res.status(500).json([{
      title: '<i>Results not found due to a server error!</i>',
      text: ''
    }]);
    return;
  }

  if(!response.body.tracks){
    res.json([{
      title: '<i>No results were found!</i>',
      text: ''
    }]);
    return;
  }

  var results = _.map(response.body.tracks.items, function(song){
    //in most cases the third image on the returning json is a 64px x 64px
    var imgUrl = song.album.images[2].url;
    var songName = song.name;
    var artistName = _.map(song.artists, function(el) {
      return el.name;
    }).join(', ');

    var fullHtml = '<table><tbody><tr><td rowspan="2"><img style="float:left;margin-right:5px;height: 55px;"src="' + imgUrl + '"></td></tr><tr><td><h4>' + songName + '</h4><h5 style="color:grey;">'+ artistName +'</h5></td></tr></tbody></table>';


    return {
      title: fullHtml,
      text: song.uri
    };
  });

  res.json(results);
};
