'use strict';

const functions = require('firebase-functions');

const {dialogflow, HtmlResponse} = require('actions-on-google');
const app = dialogflow({debug: true});

const WELCOME_GREETINGS = [
  'Welcome to the Stock Interface!'
];

const WELCOME_BACK_GREETINGS = [
  'Welcome back! What can the Stock Interface do for you?'
];

const randomArrayItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// respond when user opens the app
app.intent('Default Welcome Intent', conv => {

  // give a welcome back greeting if user has opened the app before
  if (conv.user.last.seen) {
    conv.ask(randomArrayItem(WELCOME_BACK_GREETINGS));
  }
  else {
    conv.ask(randomArrayItem(WELCOME_GREETINGS));  
  }
  
  conv.ask('Do you want to see stock information, learn, play a simulation game, or get news?');
  conv.ask(new HtmlResponse({
    //url: 'https://integrity-capstone-2020-aed3a.firebaseapp.com'
    url: 'https://integrity-capstone-2020-aed3a.web.app'
  }));
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);