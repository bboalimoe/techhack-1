var http = require('http');
var request = require('request');
/*
 * GET home page.
 */

exports.index = function(req, res){


    res.render('index', { title: 'Express' });
};