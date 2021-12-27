import { expect } from 'chai';
import 'mocha';
import * as fs from 'fs';

import { formatCode, functionEnds, FileState } from '../../formatter/formatter';

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
//       let fileContent = fs.readFileSync(`./src/test/resources/FunctionTest.flix`).toString();
//       expect(formatCode(4, fileContent, getLineBreakChar(fileContent))).to.equal(fileContent);
//     // });
//   });

// });

describe('FunctionEnds test for: ', async () => {
  // it(`oneliner function`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo = 3"];
  //   expect(functionEnds(state, lines[0], lines, lines.length, 0)).to.be.true;
  // });
  // it(`twoliner without ; function, index 1`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a + b"];
  //   expect(functionEnds(state, lines[1], lines, lines.length, 1)).to.be.true;
  // });
  // it(`twoliner without ; function, index 0`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a + b"];
  //   expect(functionEnds(state, lines[0], lines, lines.length, 0)).to.be.false;
  // });
  // it(`threeliner with ; function`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a + b;", "0"];
  //   expect(functionEnds(state, lines[2], lines, lines.length, 2)).to.be.true;
  // });
  // it(`3 liner with ; function, index 0`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a + b;", "0"];
  //   expect(functionEnds(state, lines[0], lines, lines.length, 0)).to.be.false;
  // });
  // it(`3 liner with ; function, index 1`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a + b;", "0"];
  //   expect(functionEnds(state, lines[1], lines, lines.length, 1)).to.be.false;
  // });
  // it(`3 liner without ; function, index 2`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a +", "b"];
  //   expect(functionEnds(state, lines[2], lines, lines.length, 2)).to.be.true;
  // });
  // it(`3 liner without ; function, index 1`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a +", "b"];
  //   expect(functionEnds(state, lines[1], lines, lines.length, 1)).to.be.false;
  // });
  // it(`4 liner with ; function, index 1`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a + ", "b;", "c"];
  //   expect(functionEnds(state, lines[1], lines, lines.length, 1)).to.be.false;
  // });
  // it(`4 liner with ; function, index 2`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a + ", "b;", "c"];
  //   expect(functionEnds(state, lines[2], lines, lines.length, 2)).to.be.false;
  // });
  // it(`4 liner with ; function, index 3`, () => {
  //   let state: FileState[] = [FileState.function];
  //   let lines = ["pub def foo =", "a + ", "b;", "c"];
  //   expect(functionEnds(state, lines[3], lines, lines.length, 3)).to.be.true;
  // });
});


// let flixFolderFiles = fs.readdirSync('./src/test/resources/flixapi/', { withFileTypes: true });

// flixFolderFiles.filter(f => f.isFile()).forEach(f => {

//   describe('Indentation should remain the same for: ' + f.name, async () => {
//     it(`api file`, async () => {
//       let fileContent = fs.readFileSync(`./src/test/resources/flixapi/${f.name}`).toString();
//       expect(formatCode(4, fileContent, getLineBreakChar(fileContent))).to.equal(fileContent);
//     });
//   });

// });