// The scraping is working, the articles are being logged into the DB, but I cant get them to display in the browser
const express = require('express'),
      cheerio = require('cheerio'),
      rp = require('request-promise'),
      router = express.Router(),
      db = require('../models');


router.get("/newArticles", function(req, res) {
  
  const options = {
    uri: 'https://www.nytimes.com/section/us',
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  db.Article
    .find({})
    .then((savedArticles) => {
      let savedHeadlines = savedArticles.map(article => article.headline);

        rp(options)
        .then(function ($) {
          let newArticleArr = [];

          //Im assuming my problem lies here or in the routing between files. These are the correct elelments as far as I can tell
          $('#stream-panel li').each((i, element) => {
            let newArticle = new db.Article({
              storyUrl: `https://www.nytimes.com${$(element).find('a').attr('href')}`,
              headline: $(element).find('h2').text().trim(),
              summary : $(element).find('p').text().trim(),
              imgUrl  : $(element).find('img').attr('src'),
              byLine  : $(element).find('span').text().trim()
            });
            if (newArticle.storyUrl) {
              if (!savedHeadlines.includes(newArticle.headline)) {
                newArticleArr.push(newArticle);
              }
            }
          });

        
          db.Article
            .create(newArticleArr)
            .then(result => res.json({count: newArticleArr.length}))//returning count of new articles to front end
            .catch(err => {});
        })
        .catch(err => console.log(err)); 
    })
    .catch(err => console.log(err)); //end of db.Article.find()
});// end of get request to /scrape

module.exports = router;