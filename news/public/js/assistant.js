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



async function fetchNewsAndDisplay(query=null) {
  var url = 'http://newsapi.org/v2/everything?' +
      'qInTitle=AAPL&' +
      'sortBy=popularity&' +
      'excludeDomains=&' +
      'apiKey=28201518fa35451294f5fb1498f79105';
  var req = new Request(url);
  fetch(req).then(response => response.json()).then(response =>{
    var articles = response.articles;
    var list = document.getElementById("news-list");
    var articlesLength = Object.keys(articles).length;
    console.log(articlesLength);
    console.log(articles);
    for(i=0;i<articlesLength;i++) {
      var article = articles[i];
      console.log(article);
      console.log(article.title);
      var newsTitle = document.createElement("li");
      newsTitle.appendChild(document.createTextNode(article.title));
      list.appendChild(newsTitle);
    }
  });
}