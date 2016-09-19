var request = require('supertest');
var app = require('../../server');
var nock = require('nock');


describe('Suggestions route', function(){

  var spotifyApiResponseMock = {
    tracks:{
      items: [{
        album: {
          external_urls: {
            spotify:'https://open.spotify.com/album/6TJmQnO44YE5BtTxH8pop1'
          },
          images: [
            {
              height: 64,
              url: 'https://i.scdn.co/image/d49268a8fc0768084f4750cf1647709e89a27172',
              width: 63
            }
          ]
        },
        artists: [
          {
            name: 'The Killers'
          }
        ],
        external_urls: {
          url: 'https://open.spotify.com/track/0eGsygTp906u18L0Oimnem'
        },
        name: "Mr. Brightside",
        id: "0eGsygTp906u18L0Oimnem"
      }]
    }
  };

  it('should return a call to action when the query is empty', function(done){
    request(app)
      .get('/api/suggestions/')
      .query({text: ''})
      .expect(200)
      .end(function(err, res){
        expect(res.body).toEqual([{
          title: '<i>Enter a song title!</i>',
          text: ''
        }]);
        done();
      });
  });

  it('should return a full html of a suggestion item', function(done){

    var scope = nock('https://api.spotify.com')
      .get('/v1/search')
      .query({q: 'Mr. Brightside', limit:15, type: 'track'})
      .reply(200, spotifyApiResponseMock);

    request(app)
    .get('/api/suggestions/')
    .query({text: 'Mr. Brightside'})
    .expect(200)
    .end(function(err, res){
      expect(res.body[0]).toEqual({
        title: '<table><tbody><tr><td rowspan="2"><img style="float:left;margin-right:5px;height: 55px;"src="' + spotifyApiResponseMock.tracks.items[0].album.images[0].url + '"></td></tr><tr><td><h4>' + spotifyApiResponseMock.tracks.items[0].name + '</h4><h5 style="color:grey;">'+ spotifyApiResponseMock.tracks.items[0].artists[0].name +'</h5></td></tr></tbody></table>',
        text: spotifyApiResponseMock.tracks.items[0].id
      });
      done();
    });
  });
});
