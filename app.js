var path = require('path');
var fs = require('fs');
var express = require('express');
var argv = require('yargs').argv;
var config = require('./shark-deploy-conf.js');

var app = express();
//html
app.use(config.contextPath, express.static('build/app'));
//mimg
app.use(config.contextPath, express.static('build/mimg'));
//ajax mock
app.use(config.contextPath + config.ajaxPrefix, function(req, res) {
    var data = path.join(config.rootPath, config.mock, config.ajaxPrefix, req.path);
    if (fs.existsSync(data)) {
        res.send(fs.readFileSync(data));
    } else {
        res.status(404).send('file not exist !');
    }
});
var port = argv.port || config.port;
app.listen(port, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('express listening on %d', port);
});
