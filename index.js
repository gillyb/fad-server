const fs = require('fs');
const request = require('request');
const xmlParser = require('xml2js');
const prettyjson = require('prettyjson');
const _ = require('lodash');
const md5 = require('md5');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const parser = new xmlParser.Parser({ charkey: 't' });

request.get('https://www.reddit.com/r/todayilearned/.rss', (err, response, body) => {
  // const data = JSON.parse(fs.readFileSync('json.js').toString());
  // console.log(body);
  parser.parseString(body, (err, result) => {

    const parsedFacts = {};
    result.feed.entry.forEach((e) => {

      let articleLink = /<a href=\"([a-zA-Z0-9\/\.\_\-\:\=\#\?\:\;%]+)\">\[link\]<\/a>/.exec(e.content[0].t);
      if (articleLink === null)
        return;

      const date = /([0-9]{4}-[0-9]{2}-[0-9]{2})/.exec(e.updated);
      const factDate = date[1];
      if (!parsedFacts.hasOwnProperty(factDate)) {
        parsedFacts[factDate] = [];
      }

      let fixedTitle = e.title[0].replace('TIL ', '').replace('TIL: ', '');
      if (fixedTitle.indexOf('that ') === 0)
        fixedTitle = fixedTitle.replace('that ', '');
      if (fixedTitle.indexOf('That ') === 0)
        fixedTitle = fixedTitle.replace('That ', '');
      if (fixedTitle.indexOf('Of ') === 0)
        fixedTitle = fixedTitle.replace('Of ', '');
      if (fixedTitle.indexOf('of ') === 0)
        fixedTitle = fixedTitle.replace('of ', '');

      fixedTitle = fixedTitle.substr(0, 1).toUpperCase() + fixedTitle.substr(1);

      parsedFacts[factDate].push({
        id: e.id[0],
        customId: md5(e.title),
        originalTitle: e.title[0],
        title: fixedTitle,
        link: articleLink[1] 
      });
    });

    Object.keys(parsedFacts).forEach((d) => {

      const existing = { facts: [] };
      const filename = './data/' + d;

      console.log('Looking for object: ' + d);
      s3.getObject({ Bucket: 'fad-server', Key: d }, (err, file) => {
        if (err)
          console.log('Error: ' + JSON.stringify(err));

        if (file) {
          console.log('object ' + d + ' found');
          const oldFacts = JSON.parse(file.Body.toString());
          existing.facts = oldFacts;
        }

        parsedFacts[d].forEach((f) => {
          if (_.find(existing.facts, (a) => a.customId === f.customId) === undefined) {
            existing.facts.push(f);
          }
        });

        console.log('writing file: ' + d);
        s3.putObject({
          Bucket: 'fad-server',
          Key: d,
          Body: JSON.stringify(parsedFacts[d])
        }, (err, data) => {
          if (err)
            console.log('error writing object: ' + d);
          else
            console.log('successfully written object: ' + d);
        });

      });
    });

  });
});
