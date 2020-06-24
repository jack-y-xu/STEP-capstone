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
    url: 'https://integrity-capstone-2020-aed3a.firebaseapp.com'
  }));
});

// launch app mode
app.intent('App Mode', (conv, param) => {
  
  const userAppModeChoice = param['user-app-mode'].toLowerCase();

  const ssml = 
    `<speak>
      <p>Okay, let's get you going with this.</p>
      <break time="100ms" />
      <p>Launching ${userAppModeChoice}...</p>
    </speak>`;
  
  conv.ask(ssml);

  // update webapp screen
  conv.ask(new HtmlResponse({
    data: {
      scene: userAppModeChoice,
    }
  }));
})



exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);