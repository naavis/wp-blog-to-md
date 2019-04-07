import TurndownService from 'turndown';

const turndown = new TurndownService();

const parseImageLine = (line) => {
  // TODO: Parse title from caption tags and create new <img> tags
  return line;
};

const parsePost = (post) => {
  const { title, 'wp:post_date_gmt': date, 'content:encoded': rawContent } = post;
  const fixedContent = rawContent
    .split('\n')
    .map((line) => {
      if (line.trim() === '') return '';
      if (line.startsWith('[')) return parseImageLine(line);
      return `<p>${line}</p>`;
    })
    .join('');
  const content = turndown.turndown(fixedContent);
  return {
    title,
    date,
    content,
  };
};

export { parseImageLine, parsePost };
