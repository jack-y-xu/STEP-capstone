/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This class is used as a wrapper for Interactive Canvas Assistant Action class along
 * with its callbacks.
 */
class Assistant {
  /**
   * @param  {Phaser.Scene} scene which serves as a container of all visual
   * and audio elements.
   */
  constructor(scene) {
    this.canvas = window.interactiveCanvas;
    const that = this;
    this.commands = {
      DEFAULT: function() {
        // do nothing, when no command is found
      },
    };
  }

  /**
   * Register all callbacks used by the Interactive Canvas Action
   * executed during creation time.
   */
  setCallbacks() {
    const that = this;
    // Declare the Interactive Canvas action callbacks.
    const callbacks = {
      onUpdate(data) {
      },
    };
    // Called by the Interactive Canvas web app once web app has loaded to
    // register callbacks.
    this.canvas.ready(callbacks);
  }
}

async function getSentimentsAndSort(articles) {
  //add articles to a json obj
  var jsonObject = {};
  jsonObject.documents = [];
  for(i=0;i<articles.length;i++) {
    var article = articles[i];
    var docObject = {};
    docObject.id = i+1;
    docObject.language = "en";
    docObject.text = article.name + ". " + article.description;
    jsonObject.documents.push(docObject);
  }
  //make obj into json
  var docJSON = JSON.stringify(jsonObject);
  console.log(articles);
  console.log(docJSON);
  //get the sentiment values
  var documents = {};
  fetch("https://microsoft-text-analytics1.p.rapidapi.com/sentiment", {
    "method": "POST",
    "headers": {
      "x-rapidapi-host": "microsoft-text-analytics1.p.rapidapi.com",
      "x-rapidapi-key": "968db1c3aamsh38e8276ca5be196p1bab0ejsn0973e5df894d",
      "content-type": "application/json",
      "accept": "application/json"
    },
    "body": docJSON
  }).then(response => response.json()).then(response => {
    documents = response.documents;
  });
  //now assign the scores to the actual articles
  for(i=0;i<articles.length;i++) {
    var doc = documents[i];
    articles[i].positivity = doc.documentScores.positive - doc.documentScores.negative;
  }
  //now sort the articles and return them
  console.log(typeof(articles));
  articles = [].slice.call(articles).sort(function(a,b){
    if (a.positivity == b.positivity) return 0;
    return a.positivity > b.positivity ? 1 : -1;
  });
  return articles;
}

async function displayNews(sortBySentiment=true) {
  var articles = fetchNews();
  console.log("Below is articles from fetchNews function");
  console.log(articles);
  var sortedArticles,resolvedArticles;
  //assign sentiment score to each article
  articles.then(resolved => resolvedArticles = resolved);
  console.log(resolvedArticles);
  if (sortBySentiment) resolvedArticles = sortBySentiment(resolvedArticles);
  //render articles
  renderNews(resolvedArticles);
}

function fetchNews() {
  var url = 'https://bing-news-search1.p.rapidapi.com/news/search?' +
      'q=AAPL%20STOCK';
  fetch(url, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
      "x-rapidapi-key": "968db1c3aamsh38e8276ca5be196p1bab0ejsn0973e5df894d",
      "x-bingapis-sdk": "true"
    }
  }).then(response => response.json()).then(articles => {
    var articles = articles.value;
    console.log(typeof articles);
    return articles;
  });
}

async function renderNews(articles) {
  var list = document.getElementById("news-list");
  for(i=0;i<articles.length;i++) {
    var article = articles[i];
    var newsTitle = document.createElement("li");
    newsTitle.appendChild(document.createTextNode(article.name));
    var newsDescrip = document.createElement("dd");
    newsDescrip.appendChild(document.createTextNode(article.description));
    list.appendChild(newsTitle);
    list.appendChild(newsDescrip);
  }
}