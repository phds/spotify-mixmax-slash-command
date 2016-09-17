module.exports = function(req, res){
  var songUri = req.query.text.trim();
  var html = '<iframe style="height:78px; width:300px" src="https://embed.spotify.com/?uri='+ songUri +'" frameborder="0" allowtransparency="true"></iframe>';
  res.json({
    body: html,
    raw: true
  });
};
