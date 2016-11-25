var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var express = require('express');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var sharkAutomation = require('shark-automation');
var config = require('./shark-deploy-conf.js');

/***------------- build start ---------------***/

gulp.task('build', function(cb) {
    sharkAutomation.registerBuildTasks({
        baseConf: config
    });
    var target = argv.target;
    if (!target) {
        throw new Error('--target should be provided. ex: gulp build --target test');
    }
    if (target !== 'online' && target !== 'test' && target !== 'develop') {
        throw new Error('--target should be online or test or develop');
    }

    gulp.on('error', function() {
        console.log('error error error error');
    });

    runSequence(
        // clean folders
        ['clean'],
        // // compass and copy to tmp1
        ['sass-preprocess', 'webpack-server'],
        // // use reference in html and ftl
        ['useref'],
        // // imagemin and copy to tmp1
        ['imagemin'],
        // // revision images
        ['revision-image'],
        // // revreplace images
        ['revreplace-css', 'revreplace-js'],
        // // revision css,js
        ['revision-css', 'revision-js'],
        // // revreplace html,ftl
        ['revreplace-html'],
        // // copy to build dir, copy java
        ['copy-build'],
        // callback
        cb
    );

});
/***------------- build emd ---------------***/

gulp.task('serve-express', function(cb) {
    var app = express();
    var router = sharkAutomation.registerServerRouter({
        baseConf: config,
        gulp: gulp
    });
    app.use(router);
    app.listen(config.port, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('express listening on %d', config.port);
        cb();
    });

});

gulp.task('serve', function(cb) {
    sharkAutomation.registerServerTasks({
        baseConf: config,
        gulp: gulp
    });
    runSequence(['browser-sync', 'serve-express'], 'open-url', cb);
});
