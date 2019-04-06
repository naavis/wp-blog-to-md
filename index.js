/* eslint-disable no-console */
const fs = require('fs');
const xml2js = require('xml2js');
const TurndownService = require('turndown');

const turndown = new TurndownService();
const xmlParser = new xml2js.Parser({ explicitArray: false });
const fileContents = fs.readFileSync('wordpress_dump.xml');
xmlParser.parseString(fileContents, (_, data) => {
  const { channel } = data.rss;
  channel.item.forEach((item) => {
    if (item['wp:post_type'] === 'post') {
      const { title } = item;
      console.log(title);

      const content = item['content:encoded'];
      const contentMarkdown = turndown.turndown(content);
      console.log(contentMarkdown);

      console.log('');
    }
  });
});
