var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var AV = require('avoscloud-sdk').AV;
AV.initialize("xv1cgfapsn90hyy2a42i9q6jg7phbfmdpt1404li6n93tt2r", "70sp4h8prccxzyfp56vwm9ksczji36bsrjvtwzvrzegfza67");
// 初始化 param1：应用 id、param2：应用 keyvar ProductList = AV.Object.extend("ProductList");
var ProductList = AV.Object.extend("ProductList");

async.waterfall([
    function(callback){
        var nextList =[];
     request({url:'http://next.36kr.com/posts',method:'GET',headers:{
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Cache-Control':'max-age=0',
    'Cookie':'__utma=47937701.532388177.1410687140.1410687140.1410691951.2; __utmz=47937701.1410687140.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); i_understood_the_rule=yes; sign_in_qrcode_token=7bab7793906b641db5e6094b63a6f97acac889b1b74317228472e531ab24b324; _krypton_rs_session=MUZpRkRNYTNQYnZqUHlLeDZlV0xBUWQ5SndOMERYOUlyK2VZTkp6WXA3Y0R4d1ByY1ExTTcwRDhvRjd2dTVTb01rck5QUGNLSEVIK2NUSE1ubUgrRnRJYSs3aE9kN2tUTTg2cFJmTWFsdE5BZG9tMlRZdGluWVp1NEpaMzYvdVI5OG54c2syTzFPYVpuL2FadmxJZWwxTFZaUUY1Q1JPQk9DbElHeDluR0tVbFhmZzRhb2MydHk4bSs2TWhqaXFoVW5MUHFPRmZhMDF6MTJFeUUzbGhPTVdOQ1RoREswUmpocDFZTndYY2NPdXRwYWRYd0FGNHNhYlpMWEwraVFGNGk1V09QckdUbjh6WTNZSU5JM0xVVDBrcmxwS29KUisyVEloOGhpeVNUNURveG1acUFsRjBnbkcwVTlrMW4rMk8tLWpSRG1Uc3JKNXFGTitFYm9JcHNPOGc9PQ%3D%3D--0264b8b20147f64833e914bd5752fe82c63621c2; _ga=GA1.2.532388177.1410687140',
    'User-Agent':'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36 LBBROWSER'
}},function(err, response,body){
    if(err) {
        return console.error(err);
    }
    if (!err && response.statusCode == 200) {
        var $= cheerio.load(body.toString());
        var nextList =[];
        $('.post .post-wrapper').each(function(){
                var $title= $(this).find('.product-url a');
                var item={
                   productName: $title.text().trim(),
                   productUrl: "http://next.36kr.com"+$title.attr('href')
                };
                var s= item.productName.match(/[ \+\w\t\.\u4e00-\u9fa5\u0370-\u03ff:]+/);
                var t= item.productUrl.match(/posts\/([0-9]+)\/hit/);
             //   console.log(t);
                if (Array.isArray(s)){
                    item.productName=s[0];
                }
                if (Array.isArray(t)){
                    item.productId=t[1];
                }
                nextList.push(item);

        });
        callback(null,nextList);

    }
}).end();

    },   function(productSet){
   //   console.log(productSet);
        var promise = AV.Promise.as();
        _.each(productSet, function (apiProduct) {
            promise = promise.then(function () {
                var productList = new ProductList();
                return productList.save({source:3,name: apiProduct.productName, website: apiProduct.productUrl,pid:apiProduct.productId});
            });
        });
        promise.then(function (results) {
            console.log('done!!');
        }, function (error) {
            console.log('ddd!!');

            console.dir(error);
        });

   }],function(err){
        if(err) throw err;
    });
