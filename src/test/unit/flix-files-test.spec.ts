import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';
import * as fs from 'fs';



let flixFolderFiles = fs.readdirSync('./resources/flixapi/', { withFileTypes: true });

flixFolderFiles.filter(f => f.isFile()).forEach(f => {

  describe('Indentation should remain the same for: ' + f.name, async () => {
    it(`api file`, async () => {
      let fileContent = fs.readFileSync(`./resources/flixapi/${f.name}`).toString();
      expect(parse(fileContent, 4)).to.equal(fileContent.trim());
    });
  });

});