/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var _ = require('underscore');
var path = require('path');
var app = express();
var request = require('request');
var fs = require('fs');
var AV = require('avoscloud-sdk').AV;
AV.initialize("qtvkups0ja3nrol76oy9tlspdr46jez0r2kv07o639zjr1ze", "kszldrlkdugpfzfmk5eaov9p7cy39l2m81n4qx3w9sn3bb1t");

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var Product = AV.Object.extend("Product");

var queryUrl = 'https://42matters.com/api/1/apps/top.json?listName=top_apps_local_weekly&category=0&country=CN&limit=500&access_token=37e0dc8d667fb1e1f201a51d03547bcbe618509f';
request({url: queryUrl}, function (error, response, body) {
    console.dir(error);
    if (!error && response.statusCode == 200) {
        console.log("success get !");
        var toplist = JSON.parse(body);
        var i = 0;
        var promise = AV.Promise.as();
        _.each(toplist.appList, function (apiProduct) {
            promise = promise.then(function () {
                var product = new Product();
                return product.save({source:1,name: apiProduct.package_name, website: apiProduct.website,id:apiProduct.package_name });
            });
        })
        promise.then(function (results) {
            console.log('done!!');
        }, function (error) {
            console.dir(error);
        });
    }
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
