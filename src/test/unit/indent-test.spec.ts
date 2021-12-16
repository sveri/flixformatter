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



// describe('Indentation should remain the same for: ', () => {
//   it(`api file`, async () => {
//       // let flixFolderFiles = fs.readdirSync('./src/test/resources/flixapi/', { withFileTypes: true });
      
//       // flixFolderFiles.filter(f => f.isFile()).forEach(f => {
//       let fileContent = fs.readFileSync(`./src/test/resources/flixapi/Applicative.flix`).toString();
//       expect(formatCode(4, fileContent, getLineBreakChar(fileContent))).to.equal(fileContent);
//     // });
//   });

// });


let flixFolderFiles = fs.readdirSync('./src/test/resources/flixapi/', { withFileTypes: true });

flixFolderFiles.filter(f => f.isFile()).forEach(f => {

  describe('Indentation should remain the same for: ' + f.name, async () => {
    it(`api file`, async () => {
      let fileContent = fs.readFileSync(`./src/test/resources/flixapi/${f.name}`).toString();
      expect(formatCode(4, fileContent, getLineBreakChar(fileContent))).to.equal(fileContent);
    });
  });

});