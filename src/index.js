/* eslint-disable no-console */
import { readFileSync } from 'fs';
import { Parser as XmlParser } from 'xml2js';
import { parsePost } from './parser';

const xmlParser = new XmlParser({ explicitArray: false });
const fileContents = readFileSync('wordpress_dump.xml');
xmlParser.parseString(fileContents, (_, data) => {
  const { channel } = data.rss;
  const posts = channel.item.filter(i => i['wp:post_type'] === 'post');
  posts.forEach((p) => {
    const post = parsePost(p);
    console.log(post.title);
    console.log(post.date);
    console.log('');
    console.log(post.content);
    console.log('');
    console.log('---');
    console.log('');
  });
});
