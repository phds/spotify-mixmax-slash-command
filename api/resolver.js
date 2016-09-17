module.exports = function(req, res){
  var songUri = req.query.text.trim();
  var html = '<iframe src="https://embed.spotify.com/?uri='+ songUri +'" frameborder="0" allowtransparency="true"></iframe>';
  res.json({
    body: html
  });
};
