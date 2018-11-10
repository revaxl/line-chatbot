'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'grCHAzeSWUSCkMqmU4guOpdPQ9B5oUpxpezaqufHEaS5yurKz2GAHdlEmmfCj3zIsdMRjtbLVU/qN2FZiW7KHbo418uCs8+ZRZ+b3XfYkTbvS40pcEWFNwLo32qrgms0UMdcS0HCsOYe7xeiRtambQdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'ee74a795ec41b3cb377da53efe7c93fb',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
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
const port = 5000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});