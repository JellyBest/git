const crawlerjs = require('crawler-js');
const iconv = require('iconv-lite');
const url = 'http://www.gupiaodadan.com/buy-sell-601336';
let crawler = {
  interval: 1000,
  getSample: url,
  get: url,
  preview: 0,
  extractors: [
    {
      selector: '.tablecontent tr',
      callback: function(err, html, url, response){
        console.log('Crawled url:');
        console.log(url);
        console.log('Crawled response:');
        // console.log(response); // If you need see more details about request
        if(!err){
            // html = iconv.decode(html, 'gb2312');
          data = {};
          data.world = iconv.decode(html.children('td').eq(0).text(), 'gb2312') ;
          if(typeof data.world == 'undefined'){
            delete data.world;
          }
          console.log(data);
        }else{
        //   console.log(err);
        }
      }
    }
  ]
}

crawlerjs(crawler);