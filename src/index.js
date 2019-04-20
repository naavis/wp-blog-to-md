/* eslint-disable no-console */
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
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
    const year = post.date.getUTCFullYear();
    const month = (post.date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = post.date
      .getUTCDate()
      .toString()
      .padStart(2, '0');
    const path = `output/${year}/${month}`;
    mkdirSync(path, { recursive: true });

    const title = post.title.replace(/\s+/, '-');
    const filename = `${year}-${month}-${day}-${title}.md`;

    // TODO: Write metadata information to start of file

    writeFileSync(`${path}/${filename}`, post.content);
  });
});
