import TurndownService from 'turndown';

const turndown = new TurndownService();

const parseAttachment = (rawAttachment) => {
  const {
    'wp:attachment_url': url,
    'wp:post_id': id,
    'excerpt:encoded': caption,
  } = rawAttachment;
  return { id, url, caption };
};

const parseImageLineTitle = (line) => {
  // Parse title from the caption attribute of the caption tag
  const captionTagTitleRegex = /caption="(.+?)"/;
  if (captionTagTitleRegex.test(line)) {
    const title = line.match(captionTagTitleRegex)[1].trim();
    return title;
  }

  // Parse title from the same level as the <img> tag
  const lineWithoutATag = line.replace(/<a .+?>/, '').replace('</a>', '');
  const titleRegex = /\/>(.+?)\[\/caption\]/;
  if (titleRegex.test(lineWithoutATag)) {
    const title = lineWithoutATag.match(titleRegex)[1].trim();
    return title;
  }

  return '';
};

const parseImageLine = (line) => {
  const title = parseImageLineTitle(line);
  const tagRegex = /(\[caption.+?\]).*?(<img.+?\/>)/;
  const imgTag = line.match(tagRegex)[2];
  const srcRegex = /src="(.+?)"/;
  const url = imgTag
    .match(srcRegex)[1]
    .trim()
    .split('?')[0];

  return { title, url };
};

const parsePost = (post) => {
  const { title, 'wp:post_date_gmt': date, 'content:encoded': rawContent } = post;
  const fixedContent = rawContent
    .split('\n')
    .filter(l => l.trim() !== '')
    .map((line) => {
      if (line.trim() === '') return '';

      if (line.startsWith('[caption')) {
        const image = parseImageLine(line);
        return `<img src="${image.url}" title="${image.title}" />`;
      }

      if (line.startsWith('[gallery')) {
        // TODO: Handle galleries
        return line;
      }

      return `<p>${line}</p>`;
    })
    .join('\n');
  const content = turndown.turndown(fixedContent);
  return { title, date, content };
};

export {
  parseImageLine,
  parsePost,
  parseImageLineTitle,
  parseAttachment,
};
