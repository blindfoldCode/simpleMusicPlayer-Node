var express = require('express'),
    app = express();
var fs = require('fs');
app.use(express.static(__dirname + '/public'));
var id3 = require('id3js');



app.get('/lists', function (req, res) {
    fs.readdir(__dirname + '/music', function (err, result) {
        if (err) {
            console.log(err);
        }
        result.forEach(function (fileNane, index) {
            if (fileNane == "desktop.ini") {
                result.splice(index, 1);

            }
            result[index] = result[index].substr(0, result[index].lastIndexOf('.')) || result[index];
        });

        res.send(result);
    });

});


app.get('/music/:id', function (req, res) {

    var asset = decodeURIComponent(req.url);
    res.download('.' + asset);

});

app.get('/metaData/:id', function (req, res) {

    id3({
        file: './music/Kalimba.mp3',
        type: id3.OPEN_LOCAL
    }, function (err, tags) {
        // tags now contains your ID3 tags
        res.send(tags);
    });
});   
app.listen(3000);
