const functions = require('firebase-functions');
const admin = require('firebase-admin');
require("firebase/firestore"); // for side effects
const {dialogflow, HtmlResponse} = require('actions-on-google');
const app = dialogflow({debug: true});

const STARTING_MONEY = 10000;
var userID = null;

'use strict';

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

  setUpFirestoreForUser();

  conv.ask('Tell me the ticker of the stock, ETF, or mutual fund you want to invest in.');
})

/*
* firestore hierarchy: users (collection) --> userID (document for each user)
* --> simulation (collection) --> portfolio & stats (both are documents)
*
* initalizes firestore setup for the user
*/
async function setUpFirestoreForUser() {
  const portfolio_data = {
    gains: 0,
    money_left: STARTING_MONEY,
    investments: [],
    losses: 0,
    personal_value: STARTING_MONEY,
    symbol: null
  }

  const stats_data = {
    current_price: null,
    day_index: 0,
    time_series: null
  }

  const userDocRef = database.collection('users').doc();
  userID = userDocRef.id;
  const simRef = userDocRef.collection('simulation');

  const portfolioRes = await simRef.doc('portfolio').set(portfolio_data);
  const statsRes = await simRef.doc('stats').set(stats_data);
}

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