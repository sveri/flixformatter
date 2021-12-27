import { expect } from 'chai';
import { parse, recursionTest } from '../../formatter/parser';


describe('Indentation should remain the same for: ', () => {
    // it(`one singleline comment`, () => {

    //     expect(parse(`//\n`)).to.equal("//");
    // });
    // it(`file single line comments`, () => {
    //     expect(parse("//asf\n")).to.equal("//asf");
    // });
    // it(`file multiple single line comments`, () => {

    //     expect(parse(`//\n//\r\n`)).to.equal("//\n//\n");
    // });
    it(`instance with pub def`, () => {
        expect(parse(`instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}`, 4)).to.equal(`instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}`);
    });
    // it(`file multiple single line comments with instance inbetween`, () => {

    //     expect(parse(`//\n//\r\ninstance foo {body}\n//\n`)).to.equal("//\n//\ninstance foo {\n\    body\n}\n//\n");
    // });
    // it(`file multiple single line comments`, () => {

    //     expect(parse(`//\n//\n//`)).to.equal("//\n//");
    //     // expect(parse("pub class Add { def main }")).to.equal("if (a < b)");
    // });
    // it(`file multiple single line windows LB comments`, () => {

    //     expect(parse(`//\r\n//`)).to.equal("//\n//");
    //     // expect(parse("pub class Add { def main }")).to.equal("if (a < b)");
    // });
    // it(`simple class`, () => {

    //     expect(parse("pub class Add {}")).to.equal("pub class Add {\n}");
    //     // expect(parse("pub class Add { def main }")).to.equal("if (a < b)");
    // });
    // it(`simple if condition`, () => {
    //     expect(parse("if ( a < b)")).to.equal("if (a < b)");
    //     expect(parse("if ( a < b )")).to.equal("if (a < b)");
    //     expect(parse("if (a<b)")).to.equal("if (a < b)");
    // });

});