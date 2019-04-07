import { parseImageLine } from '../src/parser';

describe('parseImageLine', () => {
  it('parsing empty line returns empty line', () => {
    expect(parseImageLine('')).toBe('');
  });
});
