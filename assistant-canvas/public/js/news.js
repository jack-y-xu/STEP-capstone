
async function displayNews(sortBySentiment=true) {
    var articles = await fetchNews();
    console.log("Below is articles from fetchNews function");
    console.log(articles);

    //assign sentiment score to each article
    if (sortBySentiment) articles = await getSentimentsAndSort(articles);

    //render articles
    renderNews(articles);
}

async function getSentimentsAndSort(articles) {
    //add articles to a json obj
    var jsonObject = {};
    jsonObject.documents = [];
    var leng = Object.keys(articles).length;
    for(i=0;i<leng;i++) {
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
    await fetch("https://microsoft-text-analytics1.p.rapidapi.com/sentiment", {
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
    for(i=0;i<leng;i++) {
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

async function fetchNews() {
    var url = 'https://bing-news-search1.p.rapidapi.com/news/search?' +
        'q=AAPL%20STOCK';
    return await fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
            "x-rapidapi-key": "968db1c3aamsh38e8276ca5be196p1bab0ejsn0973e5df894d",
            "x-bingapis-sdk": "true"
        }
    }).then(response => response.json()).then(articles => articles.value);
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