import { expect } from 'chai';
import 'mocha';
import * as fs from 'fs';

import { formatCode } from '../../formatter/formatter';

function getLineBreakChar(s: string): string {
  const indexOfLF = s.indexOf('\n', 1);  // No need to check first-character

  if (indexOfLF === -1) {
    if (s.indexOf('\r') !== -1) {
      return '\r';
    }

    return '\n';
  }

  if (s[indexOfLF - 1] === '\r') {
    return '\r\n';
  }

  return '\n';
}

describe('Indentation should remain the same', () => {

  it('for api files', async () => {
    let addflix = fs.readFileSync('./src/test/resources/flixapi/Add.flix').toString();
    console.log(formatCode(4, addflix, getLineBreakChar(addflix)));
    expect(formatCode(4, addflix, getLineBreakChar(addflix))).to.equal(addflix);
  });

});