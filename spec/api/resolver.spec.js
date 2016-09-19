var request = require('supertest');
var app = require('../../server');
var nock = require('nock');

describe('Resolver route', function(){

  var spotifyApiResponseMock = {
    "album": {
      "album_type": "album",
      "external_urls": {
        "spotify": "https://open.spotify.com/album/6TJmQnO44YE5BtTxH8pop1"
      },
      "href": "https://api.spotify.com/v1/albums/6TJmQnO44YE5BtTxH8pop1",
      "id": "6TJmQnO44YE5BtTxH8pop1",
      "images": [
        {
          "height": 640,
          "url": "https://i.scdn.co/image/8e13218039f81b000553e25522a7f0d7a0600f2e",
          "width": 629
        },
        {
          "height": 300,
          "url": "https://i.scdn.co/image/8c1e066b5d1045038437d92815d49987f519e44f",
          "width": 295
        },
        {
          "height": 64,
          "url": "https://i.scdn.co/image/d49268a8fc0768084f4750cf1647709e89a27172",
          "width": 63
        }
      ],
      "name": "Hot Fuss",
      "type": "album",
      "uri": "spotify:album:6TJmQnO44YE5BtTxH8pop1"
    },
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/0C0XlULifJtAgn6ZNCW2eu"
        },
        "href": "https://api.spotify.com/v1/artists/0C0XlULifJtAgn6ZNCW2eu",
        "id": "0C0XlULifJtAgn6ZNCW2eu",
        "name": "The Killers",
        "type": "artist",
        "uri": "spotify:artist:0C0XlULifJtAgn6ZNCW2eu"
      }
    ],
    "available_markets": [
      "AD",
      "AR",
      "TW",
      "UY"
    ],
    "disc_number": 1,
    "duration_ms": 222075,
    "explicit": false,
    "external_ids": {
      "isrc": "USIR20400274"
    },
    "external_urls": {
      "spotify": "https://open.spotify.com/track/0eGsygTp906u18L0Oimnem"
    },
    "href": "https://api.spotify.com/v1/tracks/0eGsygTp906u18L0Oimnem",
    "id": "0eGsygTp906u18L0Oimnem",
    "name": "Mr. Brightside",
    "popularity": 0,
    "preview_url": "http://d318706lgtcm8e.cloudfront.net/mp3-preview/f454c8224828e21fa146af84916fd22cb89cedc6",
    "track_number": 2,
    "type": "track",
    "uri": "spotify:track:0eGsygTp906u18L0Oimnem"
  };

  it('should return a full html of resolver item', function(done){

    var scope = nock('https://api.spotify.com')
      .get('/v1/tracks/' + spotifyApiResponseMock.id)
      .reply(200, spotifyApiResponseMock);

    request(app)
    .get('/api/resolver/')
    .query({text: spotifyApiResponseMock.id})
    .expect(200)
    .end(function(err, res){
      expect(res.body).toEqual({
        body: '<div title="Spotify" style="width: 300px;box-sizing: border-box;background-color: #282828;font-family: Circular,Helvetica,Arial,sans-serif;white-space: nowrap;text-overflow: ellipsis;text-align: center;padding: 7px;" ><div style="color: #fff;margin-bottom: 3px;width: 100%;white-space: nowrap;text-overflow: ellipsis;overflow-x: hidden;">' + spotifyApiResponseMock.name + '</div><div style="color: #a0a0a0;white-space: nowrap;text-overflow: ellipsis;overflow-x: hidden;">'+ spotifyApiResponseMock.artists[0].name +'</div><a style="text-decoration: none;"href="' + spotifyApiResponseMock.external_urls.spotify + '"><div style="color: #fff;background-color: #2ebd59;width: 130px;height: 17px;margin: auto;padding: 5px 0;border-radius: 25px;">PLAY NOW</div></a></div>'
      });
      done();
    });
  });
});
