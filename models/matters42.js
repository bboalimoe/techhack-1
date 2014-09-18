var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var AV = require('avoscloud-sdk').AV;
AV.initialize("xv1cgfapsn90hyy2a42i9q6jg7phbfmdpt1404li6n93tt2r", "70sp4h8prccxzyfp56vwm9ksczji36bsrjvtwzvrzegfza67");
// 初始化 param1：应用 id、param2：应用 key
var ProductList = AV.Object.extend("ProductList");

var queryUrl = 'https://42matters.com/api/1/apps/top.json?listName=top_apps_local_weekly&category=0&country=CN&limit=500&access_token=37e0dc8d667fb1e1f201a51d03547bcbe618509f';
request({url: queryUrl}, function (error, response, body) {
    console.log(error);
    if (!error && response.statusCode == 200) {
        console.log("successful get !");
        var toplist = JSON.parse(body);
        var promise = AV.Promise.as();
        _.each(toplist.appList, function (apiProduct) {
            promise = promise.then(function () {
                var productList = new ProductList();
                return productList.save({source:1,name: apiProduct.package_name, website: apiProduct.website,pid:apiProduct.package_name });
            });
        })
        promise.then(function (results) {
            console.log('done!!');
        }, function (error) {
            console.log(error);
        });
    }
});
