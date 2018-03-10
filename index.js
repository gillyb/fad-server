const fs = require('fs');
const request = require('request');
const xmlParser = require('xml2json');
const prettyjson = require('prettyjson');
const _ = require('lodash');
const md5 = require('md5');

request.get('https://www.reddit.com/r/todayilearned/.rss', (err, response, body) => {
  // const data = JSON.parse(fs.readFileSync('json.js').toString());
  // console.log(body);
  const data = JSON.parse(xmlParser.toJson(body));
  // console.log(prettyjson.render(JSON.parse(data)));

  const parsedFacts = {};
  data.feed.entry.forEach((e) => {
    
    const html = e.content.$t;
    let articleLink = /<a href=\"([a-zA-Z0-9\/\.\_\-\:\=\#\?\:\;%]+)\">\[link\]<\/a>/.exec(html);
    if (articleLink === null)
      return;

    const date = /([0-9]{4}-[0-9]{2}-[0-9]{2})/.exec(e.updated);
    const factDate = date[1];
    if (!parsedFacts.hasOwnProperty(factDate)) {
      parsedFacts[factDate] = [];
    }

    let fixedTitle = e.title.replace('TIL ', '').replace('TIL: ', '');
    if (fixedTitle.indexOf('that ') === 0)
      fixedTitle = fixedTitle.replace('that ', '');
    if (fixedTitle.indexOf('That ') === 0)
      fixedTitle = fixedTitle.replace('That ', '');

    fixedTitle = fixedTitle.substr(0, 1).toUpperCase() + fixedTitle.substr(1);

    parsedFacts[factDate].push({
      id: e.id,
      customId: md5(e.title),
      originalTitle: e.title,
      title: fixedTitle,
      link: articleLink[1] 
    });
  });

  Object.keys(parsedFacts).forEach((d) => {

    const existing = { facts: [] };
    const filename = './data/' + d;
    if (fs.existsSync(filename)) {
      const old = JSON.parse(fs.readFileSync(filename).toString());
      existing.facts = old.facts;
    }

    parsedFacts[d].forEach((f) => {
      if (_.find(existing.facts, (a) => a.customId === f.customId) === undefined) {
        existing.facts.push(f);
      }
    });

    // Save the facts to a file
    fs.writeFileSync(filename, JSON.stringify(existing));
  });

  // const filteredFacts = _.filter(interesting, (f) => !!f.link);

  // console.log(prettyjson.render(filteredFacts));

});
