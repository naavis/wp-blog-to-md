# Wordpress to Markdown converter

One-off utility for converting my astronomy blog from Wordpress export format to
Markdown.

## How to use?

Place Wordpress export XML file in the following place with the following name:
`input/wordpress_dump.xml` and place all images from the media export to
`input/media/`. They should have subfolders such as `2018/11/`, `2019/03/` etc.

Then run:

```
npm install
npm start
```

The resulting files should appear in the `output` folder.

## Disclaimer

I in no way guarantee that this will work for anyone else. I do not intend to
use this again, now that I have my blog entries in Markdown format and can move
on.
