'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
require("firebase/firestore"); // for side effects
const {dialogflow, HtmlResponse} = require('actions-on-google');
const app = dialogflow({debug: true});


// Initialize Firestore through Firebase
admin.initializeApp({
  apiKey: 'AIzaSyAdiOkMkrbZwN1nuTIWsazqjhSwrcz_nNk',
  authDomain: 'integrity-capstone-2020-aed3a.firebaseapp.com',
  projectId: 'integrity-capstone-2020-aed3a'
});

const database = admin.firestore();
process.env.DEBUG = 'dialogflow:debug';

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
app.intent('Simulation', conv => {
  const ssml = 
    `<speak>
      <p>Okay, let's get you going with this.</p>
      <break time="100ms" />
      <p>Launching the simulation...</p>
    </speak>`;
  
  conv.ask(ssml);
  
  // update webapp screen
  conv.ask(new HtmlResponse({
    data: {
      scene: 'simulation',
    }
  }));

  conv.ask('Tell me the ticker of the stock, ETF, or mutual fund you want to invest in.');
  conv.ask('If you don\'t know what those terms mean, you can ask to launch a tutorial.');
})

// deal with simulation
app.intent('Simulation - Invest', (conv, param) => {

  const userSymbol = param['user-symbol'].toUpperCase();
  updateSymbolInDatabase(userSymbol);
  conv.ask('Great! Now how many shares do you want to buy?');
  
  // TODO: get the price from firestore
  conv.ask('The current price per share is $100');
  conv.ask(new HtmlResponse());
});

async function updateSymbolInDatabase(userSymbol) {
  const portfolioRef = database.collection('simulation').doc('portfolio');
  const res = await portfolioRef.update({symbol: userSymbol});
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);