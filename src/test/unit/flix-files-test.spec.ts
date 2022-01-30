import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';
import * as fs from 'fs';
var Path = require('path');



let flixFolderFiles = fs.readdirSync('./resources/flixapi/', { withFileTypes: true });

flixFolderFiles.filter(f => f.isFile() && Path.extname(f.name) === ".flix").forEach(f => {

  describe('Indentation should remain the same for: ' + f.name, async () => {
    it(`api file`, async () => {
      let fileContent = fs.readFileSync(`./resources/flixapi/${f.name}`).toString();
      let expectedFileContent = fileContent;
      if(fs.existsSync(`./resources/flixapi/${f.name}_expected`)){
        expectedFileContent = fs.readFileSync(`./resources/flixapi/${f.name}_expected`).toString();      
        console.log("------------------------- exists");
      }

      expect(parse(fileContent, 4)).to.equal(expectedFileContent.trim());
    });
  });

});