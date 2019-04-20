import { parseImageLineTitle, parseImageLine, parseGalleryLine } from '../src/parser';

const lineWithImgTag = '[caption id="attachment_1602" align="alignnone" width="1200"]<img class="alignnone size-full wp-image-1602" src="https://astronaavis.files.wordpress.com/2018/08/lentokone-teide-lahto.jpg" alt="lentokone-teide-lahto" width="1200" height="900" /> Lähtiessä Teneriffalta pilviä oli huomattavasti vähemmän kuin tullessa.[/caption]';
const lineWithImgAndATag = '[caption id="attachment_156" align="aligncenter" width="500"]<a href="http://astronaavis.files.wordpress.com/2012/10/img_2815.jpg"><img class=" wp-image-156 " title="akuo-huussi" alt="" src="http://astronaavis.files.wordpress.com/2012/10/img_2815.jpg?w=300" width="500" /></a> Havaintosuoja ennen muunnosprojektia. Kuva: Lauri Kangas[/caption]';
const lineWithTitleInCaptionTag = '[caption id="" align="aligncenter" width="300" caption="Ion ja Ganymedeen ylikulku"]<img title="Jupiter double transit" src="http://www.ursa.fi/%7Esavuori/astro/2011_10_31-kaivopuisto/2011_10_31-jupiter_double_transit.gif" alt="" width="300" height="300" />[/caption]';

describe('parseImageLineTitle', () => {
  it('returns an empty line when parsing an empty line', () => {
    expect(parseImageLineTitle('')).toBe('');
  });

  it('parses a title at the same level with an img tag', () => {
    const result = parseImageLineTitle(lineWithImgTag);
    expect(result).toBe('Lähtiessä Teneriffalta pilviä oli huomattavasti vähemmän kuin tullessa.');
  });

  it('parses a title at the same level with an img and a tags', () => {
    const result = parseImageLineTitle(lineWithImgAndATag);
    expect(result).toBe('Havaintosuoja ennen muunnosprojektia. Kuva: Lauri Kangas');
  });

  it('parses a title from the caption attribute from the caption tag', () => {
    const result = parseImageLineTitle(lineWithTitleInCaptionTag);
    expect(result).toBe('Ion ja Ganymedeen ylikulku');
  });
});

describe('parseImageLine', () => {
  it('finds title and link in line with an img tags', () => {
    const result = parseImageLine(lineWithImgTag);
    expect(result).toEqual({
      title: 'Lähtiessä Teneriffalta pilviä oli huomattavasti vähemmän kuin tullessa.',
      url: 'https://astronaavis.files.wordpress.com/2018/08/lentokone-teide-lahto.jpg',
    });
  });

  it('finds title and line in line with img and a tags', () => {
    const result = parseImageLine(lineWithImgAndATag);
    expect(result).toEqual({
      title: 'Havaintosuoja ennen muunnosprojektia. Kuva: Lauri Kangas',
      url: 'http://astronaavis.files.wordpress.com/2012/10/img_2815.jpg',
    });
  });

  it('finds title and line in line with title in caption tag', () => {
    const result = parseImageLine(lineWithTitleInCaptionTag);
    expect(result).toEqual({
      title: 'Ion ja Ganymedeen ylikulku',
      url:
        'http://www.ursa.fi/%7Esavuori/astro/2011_10_31-kaivopuisto/2011_10_31-jupiter_double_transit.gif',
    });
  });
});

describe('parseGalleryLine', () => {
  it('parses correct ids from gallery line', () => {
    const galleryLine = '[gallery ids="123,456,789" type="rectangular"]';
    const result = parseGalleryLine(galleryLine);
    expect(result).toEqual({ ids: [123, 456, 789] });
  });
});
