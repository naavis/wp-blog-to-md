/* eslint-disable no-console */
import { readFileSync } from 'fs';
import { Parser } from 'xml2js';
import TurndownService from 'turndown';

const turndown = new TurndownService();
const parsePost = (post) => {
  const { title } = post;
  const content = post['content:encoded'];
  const fixedContent = content
    .split('\n')
    .map((line) => {
      if (line.trim() === '') return '';
      if (line.startsWith('[')) return line;
      return `<p>${line}</p>`;
    })
    .join('');
  const contentMarkdown = turndown.turndown(fixedContent);
  return {
    title,
    content: contentMarkdown,
  };
};

const xmlParser = new Parser({ explicitArray: false });
const fileContents = readFileSync('wordpress_dump.xml');
xmlParser.parseString(fileContents, (_, data) => {
  const { channel } = data.rss;
  channel.item.forEach((item) => {
    if (item['wp:post_type'] === 'post') {
      const post = parsePost(item);
      console.log(post.title);
      console.log(post.content);
      console.log('');
    }
  });
});
