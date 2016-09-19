var request = require('request');
var _ = require('underscore');

module.exports = function(req, res){

  var term = req.query.text.trim();

  //prompt the user for information
  if (!term) {
    res.json([{
      title: '<i>Enter a song title!</i>',
      text: ''
    }]);
    return;
  }

  request({
    url: 'https://api.spotify.com/v1/search',
    qs: {
      q: term,
      limit: 15,
      type: 'track'
    },
    json: true
  }, processResponse);

  function processResponse(error, response){
    try{
      if (error || response.statusCode !== 200 || !response.body) {
        res.status(500).json([{
          title: 'Results not found due to a server error!',
          text: ''
        }]);
        return;
      }

      if(!response.body.tracks){
        res.status(500).json([{
          title: '<i>No results were found!</i>',
          text: ''
        }]);
        return;
      }

      var results = _.map(response.body.tracks.items, function(song){
        //the last image is the smallest size one, usually 64x64px
        var images = song.album.images;
        var imgUrl;
        if(images){
          imgUrl = song.album.images[images.length - 1].url;
        }
        var songName = song.name;
        //there might be more than one artist on a song
        var artistName = _.map(song.artists, function(el) {
          return el.name;
        }).join(', ');

        var fullHtml = '<table><tbody><tr><td rowspan="2"><img style="float:left;margin-right:5px;height: 55px;"src="' + imgUrl + '"></td></tr><tr><td><h4>' + songName + '</h4><h5 style="color:grey;">'+ artistName +'</h5></td></tr></tbody></table>';

        return {
          title: fullHtml,
          text: song.id
        };
      });

      res.json(results);
    } catch(e){
      //it'd be interesting to have an logging tool saving the error message
      //plus information about what led to it
      //right now it is being lost, but I reckon we should at least tell the user
      res.status(500).json([{
        title: '<i>Results not found due to a server error!</i>',
        text: ''
      }]);
      return;
    }
  }
};
