/* eslint-disable no-console */
import { readFileSync } from 'fs';
import { Parser as XmlParser } from 'xml2js';
import { parsePost, parseAttachment } from './parser';

const xmlParser = new XmlParser({ explicitArray: false });
const fileContents = readFileSync('wordpress_dump.xml');
xmlParser.parseString(fileContents, (_, data) => {
  const { item: items } = data.rss.channel;

  const attachments = items
    .filter(i => i['wp:post_type'] === 'attachment')
    .map(a => parseAttachment(a));

  const posts = items.filter(i => i['wp:post_type'] === 'post').map(p => parsePost(p, attachments));

  posts.forEach((post) => {
    console.log(post.title);
    console.log(post.date);
    console.log('');
    console.log(post.content);
    console.log('');
    console.log('---');
    console.log('');
  });
});
