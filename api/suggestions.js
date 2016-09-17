var request = require('request');
var sync = require('synchronize');
var _ = require('underscore');

module.exports = function(req, res){

  var term = req.query.text.trim();

  if (!term) {
    res.json([{
      title: '<i>(enter a song title)</i>',
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
    console.log(e);
    res.status(500).send('Error');
    return;
  }

  if (response.statusCode !== 200 || !response.body || !response.body.tracks) {
    res.status(500).send('Error');
    return;
  }

  var results = _.map(response.body.tracks.items, function(song){
    var imgUrl = song.album.images[2].url;
    var songName = song.name;
    console.log(JSON.stringify(song.artists, null, 2));
    var artistName = _.map(song.artists, function(el) {
      return el.name;
    }).join(', ');

    return {
      title: '<img style="float:left;margin-right:5px;height: 55px;"src="' + imgUrl + '"><h4>' + songName + '</h4><h5 style="color:grey;">'+ artistName +'</h5>',
      text: song.uri
    };
  });
  if(results.length === 0){
    res.json([{
      title: '<i>(no results)</i>',
      text: 'title dhaiudhsaiu'
    }]);
  }
  else{
    res.json(results);
  }
};
