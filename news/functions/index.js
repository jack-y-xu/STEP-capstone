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

'use strict';

const functions = require('firebase-functions');
const {dialogflow, HtmlResponse} = require('actions-on-google');

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = dialogflow({debug: true});

app.intent('Welcome', (conv) => {
  conv.ask(`Welcome to the news API`);
  conv.ask(new HtmlResponse({
    url: `https://integrity-capstone-2020-aed3a.firebaseapp.com`,
  }));
});

app.intent('Fallback', (conv) => {
  conv.ask(`I don’t understand.`);
  conv.ask(new HtmlResponse());
});

/**
 * Provide standard instructions
 *
 * @param  {conv} standard Actions on Google conversation object.
 */
app.intent('Instructions', (conv) => {
  conv.ask(`${INSTRUCTIONS}`);
  conv.ask(new HtmlResponse());
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
