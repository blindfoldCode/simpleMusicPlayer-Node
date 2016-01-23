var express = require('express'),
  app = express();
var fs = require('fs');
app.use(express.static(__dirname + '/public'));

const mm = require('musicmetadata');


app.get('/lists', function(req, res) {
  fs.readdir(__dirname + '/music', function(err, result) {
    if (err) {
      console.log(err);
    }
    result.forEach(function(fileNane, index) {
      if (fileNane == "desktop.ini") {
        result.splice(index, 1);

      }
      result[index] = result[index].substr(0, result[index].lastIndexOf('.')) || result[index];
    });

    res.send(result);
  });

});


app.get('/music/:id', function(req, res) {

  var asset = decodeURIComponent(req.url);
  res.download('.' + asset);

});

app.get('/metaData/:id', function(req, res) {

  var parser = mm(fs.createReadStream(`./music/${req.params.id}.mp3`), function(err, metadata) {
    if (err) throw err;
    var buf = new Buffer(metadata.picture[0].data);
    var     str = buf.toString('base64');
    const senr = {
      id: req.params.id,
      type:metadata.picture[0].format,
      data:str
    };
    res.send(senr);
  });



});
app.listen(3000);
