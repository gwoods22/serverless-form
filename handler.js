'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

function sendEmail(formData, callback) {
  const emailParams = {
    Source: 'graemewoods202@gmail.com',
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: ['graemewoods202@gmail.com'], // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.reply_to}`,
          // Data: `${formData2}\n${JSON.stringify(formData)}\n${formData.name}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New message from Grow With Graeme',
      },
    },
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.staticSiteMailer = (event, context, callback)=> {

  const formData = JSON.parse(event.body);

  sendEmail(formData, function(err, data) {
    let response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://student.athabascau.ca',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    }

    callback(null, response);
  });
};
