var request = require('request');
var sync = require('synchronize');
var _ = require('underscore');

module.exports = function(req, res){
  var songId = req.query.text.trim();

  var response;
  try{
    response = sync.await(request({
      url: 'https://api.spotify.com/v1/tracks/' + songId,
      json: true
    }, sync.defer()));
  } catch(e) {
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

  var externalUrl = response.body.external_urls.spotify;
  var albumCover = response.body.album.images[1].url;
  var songName = response.body.name;
  var artistName = _.map(response.body.artists, function(el) {
    return el.name;
  }).join(', ');
  var html = '<div title="Spotify" style="height:80px;width: 300px;position:relative;border:1px solid #282828;box-sizing:border-box;background-color: #282828;" ><a href="' + externalUrl + '"><div style="width:78px;background-image:url(' + albumCover + ');background-size: cover;position:absolute;left:0;top:0;bottom:0;display:block;"></div><div style="background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjcuNSAxNjcuNSI+PHBhdGggc3R5bGU9ImZpbGw6IzFFRDc2MCIgZD0iTTgzLjcgMEMzNy41IDAgMCAzNy41IDAgODMuN2MwIDQ2LjMgMzcuNSA4My43IDgzLjcgODMuNyA0Ni4zIDAgODMuNy0zNy41IDgzLjctODMuN1MxMzAgMCA4My43IDB6TTEyMiAxMjAuOGMtMS40IDIuNS00LjYgMy4yLTcgMS43LTE5LjgtMTItNDQuNS0xNC43LTczLjctOC0yLjguNS01LjYtMS4yLTYuMi00LS4yLTIuOCAxLjUtNS42IDQtNi4yIDMyLTcuMyA1OS42LTQuMiA4MS42IDkuMyAyLjYgMS41IDMuNCA0LjcgMS44IDcuMnpNMTMyLjUgOThjLTIgMy02IDQtOSAyLjItMjIuNS0xNC01Ni44LTE4LTgzLjQtOS44LTMuMiAxLTctMS04LTQuM3MxLTcgNC42LThjMzAuNC05IDY4LjItNC41IDk0IDExIDMgMiA0IDYgMiA5em0xLTIzLjhjLTI3LTE2LTcxLjYtMTcuNS05Ny40LTkuNy00IDEuMy04LjItMS05LjUtNS4yLTEuMy00IDEtOC41IDUuMi05LjggMjkuNi05IDc4LjgtNy4yIDEwOS44IDExLjIgMy43IDIuMiA1IDcgMi43IDEwLjctMiAzLjgtNyA1LTEwLjYgMi44eiIvPjwvc3ZnPg==);display: block;bottom: 8px;width: 20px;height: 20px;position: absolute;right: 10px;"></div><button style="background-image: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIyNiAxNDgxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDEzOTRWODdDMCA0Ni4zIDEzLjMgMTkuOCA0MCA3LjUgNjYuNy00LjggOTguNy4zIDEzNiAyM2wxMDM0IDYzNGMzNy4zIDIyLjcgNTYgNTAuMyA1NiA4M3MtMTguNyA2MC4zLTU2IDgzTDEzNiAxNDU4Yy0zNy4zIDIyLjctNjkuMyAyNy44LTk2IDE1LjUtMjYuNy0xMi4zLTQwLTM4LjgtNDAtNzkuNXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=);background-color: rgba(0,0,0,.7);-webkit-transform: scale(.6);transform: scale(.6);border: 1px solid #a0a0a0;width: 64px;height: 64px;left: 7px;top: 7px;background-position: 58% 50%;border-radius: 500px;background-size: 24px;cursor: pointer;background-repeat: no-repeat;position:absolute;"></button><div style="position: absolute;left: 90px;top: 14px;right:40px;font-family: Circular,Helvetica,Arial,sans-serif;"><div style="color: #fff;margin-bottom: 3px;overflow-x: hidden;white-space: nowrap;text-overflow: ellipsis;">' + songName + '</div><div style="white-space: nowrap;color: #a0a0a0;overflow: hidden;text-overflow: ellipsis;">'+ artistName +'</div></div></a></div>';
  res.json({
    body: html
  });
};
