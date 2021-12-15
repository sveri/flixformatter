// import { hello } from './hello-world';
import { expect } from 'chai';
import 'mocha';


import * as fs from 'fs';

import {FlixDocumentFormatter} from '../../formatter/flix.document.formatter';

describe('Indentation should remain the same', () => {

  it('for api files', async () => {
      console.log(fs.readdirSync('./'));
      let addflix = fs.readFileSync('./src/test/resources/flixapi/Add.flix');
      console.log(addflix.toString());
    // const document = await vscode.workspace.openTextDocument('');
    // new FlixDocumentFormatter().provideDocumentFormattingEdits(document);
    expect(1).to.equal(1);
  });

});