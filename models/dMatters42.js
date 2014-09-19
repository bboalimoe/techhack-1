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
        query.limit(50);
        query.find({
            success: function(results) {
            queryList=[];
            for (var i = 0; i < results.length; i++) {
              queryUrl='https://42matters.com/api/1/apps/lookup.json?&access_token=05bcf0a70f5bec89fe116302e319958041bf4e32&p=';
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
    },function(queryList,callback){
        var proDetailList=[];
        var i=0;
        async.eachSeries(queryList,function(query,next){
            request({url: query.productUrl}, function (error, response, body) {
                   if(error) console.log(error+"qqq");
                console.log( "resStat:"+ response.statusCode+"-" + i++);
             //   if (!error && response.statusCode == 200) {
                if (!error) {
                    console.log("successful get !"+ i);
                    var proRes = JSON.parse(body);
                    var item={
                        productId : query.productId,
                        proDetail : proRes
                    }
                    proDetailList.push(item);
                }
                next();
            });
        },function(err){

            if (err) console.log(err);
            console.log("successful ");
            callback(null, proDetailList)
        });

    },function(proDetailList){
        var promise = AV.Promise.as();
        _.each(proDetailList, function (apiProduct) {
            promise = promise.then(function () {
                var productDetail = new ProductDetail();


                /*  var productList = new ProductList();
              var query = new AV.Query(ProductList);
              query.equalTo("pid", apiProduct.productId);
                return  query.find({
                    success: function(queryProductList) {
                        productDetail.set("raw_data",apiProduct.proDetail);
                        productDetail.set("pid",apiProduct.productId);
                //      productDetail.set("parent",queryProductList.id);
                        productDetail.save();
                        console.log("rr")
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
                */
                productDetail.set("raw_data",apiProduct.proDetail);
                productDetail.set("pid",apiProduct.productId);
                productDetail.set("market_update",apiProduct.proDetail.market_update);
                productDetail.set("price_numeric",apiProduct.proDetail.price_numeric);
                productDetail.set("price_currency",apiProduct.proDetail.price_currency);
                productDetail.set("icon",apiProduct.proDetail.icon);
                productDetail.set("package_name",apiProduct.proDetail.package_name);
                productDetail.set("iap",apiProduct.proDetail.price_numeric);
                productDetail.set("price_numeric",apiProduct.proDetail.iap);
                productDetail.set("title",apiProduct.proDetail.title);
                productDetail.set("version",apiProduct.proDetail.version);
                productDetail.set("downloads",apiProduct.proDetail.market_url);
                productDetail.set("size",apiProduct.proDetail.size);
                productDetail.set("number_ratings",apiProduct.proDetail.number_ratings);
                productDetail.set("deep_link",apiProduct.proDetail.deep_link);
                productDetail.set("cat_type",apiProduct.proDetail.cat_type);
                productDetail.set("created",apiProduct.proDetail.created);
                productDetail.set("cat_int",apiProduct.proDetail.cat_int);
                productDetail.set("rating",apiProduct.proDetail.rating);
                productDetail.set("promo_video",apiProduct.proDetail.promo_video);
                productDetail.set("screenshots",apiProduct.proDetail.screenshots);
                productDetail.set("developer",apiProduct.proDetail.developer);
                productDetail.set("content_rating",apiProduct.proDetail.content_rating);
                productDetail.set("price",apiProduct.proDetail.price);
                productDetail.set("version_code",apiProduct.proDetail.version_code);
                productDetail.set("website",apiProduct.proDetail.website);
                productDetail.set("description",apiProduct.proDetail.description);
                productDetail.set("category",apiProduct.proDetail.category);






                return productDetail.save();

              //  return productDetail.save({source:1,name: apiProduct.package_name, website: apiProduct.website,pid:apiProduct.package_name });
            });
        })
        promise.then(function (results) {
            console.log('done!!');
        }, function (error) {
            console.log(error);
        });

    }],function(err){
    if(err) throw err;
});