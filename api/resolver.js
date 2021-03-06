var request = require('request');
var _ = require('underscore');

module.exports = function(req, res){

  var songId = req.query.text.trim();

  request({
    url: 'https://api.spotify.com/v1/tracks/' + songId,
    json: true
  }, processResponse);

  function processResponse(error, response){

    if (error || response.statusCode !== 200 || !response.body) {
      res.status(500).json([{
        body: '<i>Results not found due to a server error!</i>'
      }]);
      return;
    }

    //extract the data from spotify's response
    var externalUrl = response.body.external_urls.spotify;
    var images = response.body.album.images;
    var albumCover;
    if(images){
      albumCover = images[images.length - 1].url;
    }
    var songName = response.body.name;
    var artistName = _.map(response.body.artists, function(el) {
      return el.name;
    }).join(', ');

    //put the data on the html that will be exposed to the client
    var html = '<div title="Spotify" style="width: 300px;box-sizing: border-box;background-color: #282828;font-family: Circular,Helvetica,Arial,sans-serif;white-space: nowrap;text-overflow: ellipsis;text-align: center;padding: 7px;" ><div style="color: #fff;margin-bottom: 3px;width: 100%;white-space: nowrap;text-overflow: ellipsis;overflow-x: hidden;">' + songName + '</div><div style="color: #a0a0a0;white-space: nowrap;text-overflow: ellipsis;overflow-x: hidden;">'+ artistName +'</div><a style="text-decoration: none;"href="' + externalUrl + '"><div style="color: #fff;background-color: #2ebd59;width: 130px;height: 17px;margin: auto;padding: 5px 0;border-radius: 25px;">PLAY NOW</div></a></div>';
    res.json({
      body: html
    });
  }
};
