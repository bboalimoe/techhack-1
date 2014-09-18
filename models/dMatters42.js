var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var AV = require('avoscloud-sdk').AV;
AV.initialize("xv1cgfapsn90hyy2a42i9q6jg7phbfmdpt1404li6n93tt2r", "70sp4h8prccxzyfp56vwm9ksczji36bsrjvtwzvrzegfza67");
// 初始化 param1：应用 id、param2：应用 key
var ProductList = AV.Object.extend("ProductList");
var ProductDetail = AV.Object.extend("ProductDetail");

var query = new AV.Query(ProductList);

async.waterfall([
    function(callback){
        query.equalTo("source", 1);
        query.find({
            success: function(results) {
            queryList=[];
            for (var i = 0; i < results.length; i++) {
              queryUrl='https://42matters.com/api/1/apps/lookup.json?&access_token=37e0dc8d667fb1e1f201a51d03547bcbe618509f&p=';
              queryUrl = queryUrl + results[i].get('pid');
              var item={
                  productId:results[i].get('pid'),
                  productUrl:queryUrl
              }
              queryList.push(item);

        }
     //    console.log(queryUrlList);
        callback(null,queryList);
    },
    error: function(error) {
        alert("Error: " + error.code + " " + error.message);
    }
});
    },function(queryList,callback)
    {    var proDetailList=[1,2];
        console.log("gg");
        async.eachSeries(queryList,function(query,next){
          console.log(query);
            next();
        },function(err){
            if (err) throw err;
        });
     callback(null,proDetailList);
    },function(proDetailListg){
        console.log(proDetailList[0]);

    }],function(err){
    if(err) throw err;
});