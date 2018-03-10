'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'wE9kEz17Jwt2Fvyd0jg4piPXSEwTC6lj+yyeZcz+jqcY/aGJ8aL5kgca/9tA6ARaf5GiZKOS0ySWqs8bHWEtf3WlOPLcEoigEosb6ft/+zZVTrDdObf2MYxbZCSDYSYn9Fn9N4ZNymu3aeXZ9974egdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'fecf9639046944bd51d761231da00a12',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
