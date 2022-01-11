import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('Comment Indentation should remain the same for: ', () => {

    it(`one single line comment`, () => {

        expect(parse(`//\n`, 4)).to.equal("//");
    });
    it(`one nonempty single line comment`, () => {

        expect(parse(`//foo\n`, 4)).to.equal("//foo");
    });
    it(`single line commens with one word`, () => {
        expect(parse("//asffoo\r\n", 4)).to.equal("//asffoo");
    });
    it(`single line comment with spaced text`, () => {
        expect(parse("//asf foo\n", 4)).to.equal("//asf foo");
    });
    it(`multiple single line comments`, () => {
        expect(parse(`//\n//\n`, 4)).to.equal("//\n//");
    });
    it(`three single line comments`, () => {
        expect(parse(`//\n//\n//\n`, 4)).to.equal("//\n//\n//");
    });
    
    it(`multiline comment on one line`, () => {
        expect(parse(`/*  sdlfkj */\n`, 4)).to.equal("/*  sdlfkj */");
    });
    
    it(`multiline comment on two lines`, () => {
        expect(parse(`/*  sdlfkj
* foobar */\n`, 4)).to.equal(`/*  sdlfkj
* foobar */`);
    });
    
    it(`multiline comment on four lines`, () => {
        expect(parse(`/*  
 *        sdlfkj
 * sbaz
  */\n`, 4)).to.equal(`/*  
 *        sdlfkj
 * sbaz
  */`);});
    
    it(`two multiline comments`, () => {
        expect(parse(`/*  
 * foobar 
  */
/*  
* foobar 
    */\n`, 4)).to.equal(`/*  
 * foobar 
  */
/*  
* foobar 
    */`);
    });
    
    it(`single and multiline comment together`, () => {
        expect(parse(`// foo
// bar
/*  
 *        sdlfkj
 * foobar 
  */
// baz\n`, 4)).to.equal(`// foo
// bar
/*  
 *        sdlfkj
 * foobar 
  */
// baz`);
    });


    
});