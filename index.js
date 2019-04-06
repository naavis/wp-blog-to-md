const fs = require('fs');
const xml2js = require('xml2js');
const TurndownService = require('turndown');
const turndown = new TurndownService();

const xmlParser = new xml2js.Parser({ explicitArray: false });
const fileContents = fs.readFileSync('wordpress_dump.xml');
xmlParser.parseString(fileContents, (_, data) => {
    var channel = data.rss.channel;
    channel.item.forEach(item => {
        if (item['wp:post_type'] == 'post') {
            const title = item.title;
            console.log(title);

            const content = item['content:encoded'];
            const content_md = turndown.turndown(content);
            console.log(content_md);

            console.log('');
        }
    });
});