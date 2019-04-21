/* eslint-disable no-console */
import {
  readFileSync, mkdirSync, writeFileSync, copyFileSync, existsSync,
} from 'fs';
import { Parser as XmlParser } from 'xml2js';
import glob from 'glob-fs';
import path from 'path';
import { parsePost, parseAttachment } from './parser';

const mediaFolderRelativeToOutput = '.';

const preparePostForOutput = (post, mediaFolder) => {
  const year = post.date.getUTCFullYear();
  const month = (post.date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = post.date
    .getUTCDate()
    .toString()
    .padStart(2, '0');

  const outputPath = 'output';

  const sanitizedTitle = post.title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '_')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o');

  const filename = `${year}-${month}-${day}-${sanitizedTitle}.md`;
  const localFileRegex = /http[s]?:\/\/astronaavis.files.wordpress.com\/(\d+)\/(\d+)\/([A-Za-z0-9_-]+\.[a-z]+)/g;
  const contentsWithRelativeLinks = post.content.replace(localFileRegex, `${mediaFolder}/$1-$2-$3`);

  const postContents = `---
title: ${post.title}
date: ${post.date.toISOString()}
---
${contentsWithRelativeLinks}`;

  return { outputPath, filename, postContents };
};

const xmlParser = new XmlParser({ explicitArray: false });
const fileContents = readFileSync('./input/wordpress_dump.xml');
xmlParser.parseString(fileContents, (_, data) => {
  const { item: items } = data.rss.channel;

  const attachments = items
    .filter(i => i['wp:post_type'] === 'attachment')
    .map(a => parseAttachment(a));

  const posts = items.filter(i => i['wp:post_type'] === 'post').map(p => parsePost(p, attachments));

  posts.forEach((post) => {
    const { outputPath, filename, postContents } = preparePostForOutput(
      post,
      mediaFolderRelativeToOutput,
    );

    mkdirSync(outputPath, { recursive: true });
    writeFileSync(`${outputPath}/${filename}`, postContents);
  });

  glob()
    .readdirPromise('./input/media/**/*')
    .then((files) => {
      const basePath = path.join('./output', mediaFolderRelativeToOutput);
      if (!existsSync(basePath)) {
        mkdirSync(basePath, { recursive: true });
      }
      files.forEach((file) => {
        const [filename, month, year] = file.split(path.sep).reverse();
        const newFilename = path.join(basePath, `${year}-${month}-${filename}`);

        copyFileSync(file, newFilename);
      });
    })
    .catch((error) => {
      console.log(error);
    });
});
