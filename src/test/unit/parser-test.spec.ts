import { expect } from 'chai';
import { parse } from '../../formatter/parser';


describe('Indentation should remain the same for: ', () => {
    it(`one singleline comment`, () => {

        expect(parse(`//\n`, 4)).to.equal("//");
    });
    it(`file single line comments`, () => {
        expect(parse("//asf foo\n", 4)).to.equal("//asf foo");
    });
    it(`file multiple single line comments`, () => {
        expect(parse(`//\n//
`, 4)).to.equal("//\n//");
    });
    it(`file three single line comments`, () => {
        expect(parse(`//\n//\n//
`, 4)).to.equal("//\n//\n//");
    });
    
    it(`multiline comment on one line`, () => {
        expect(parse(`/*  sdlfkj */\n`, 4)).to.equal("/*  sdlfkj */");
    });
    
    it(`multiline comment on two lines`, () => {
        expect(parse(`/*  sdlfkj
foobar */\n`, 4)).to.equal(`/*  sdlfkj
foobar */`);
    });
    
    it(`multiline comment on four lines`, () => {
        expect(parse(`/*  
        sdlfkj
foobar 
  */\n`, 4)).to.equal(`/*  
        sdlfkj
foobar 
  */`);
    });
    
    it(`single and multiline comment together`, () => {
        expect(parse(`// foo
// bar
/*  
        sdlfkj
foobar 
  */
// baz\n`, 4)).to.equal(`// foo
// bar
/*  
        sdlfkj
foobar 
  */
// baz`);
    });


    it(`instance with pub def`, () => {
        expect(parse(`instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}`, 4)).to.equal(`instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}`);
    });

    it(`instance with pub def and comments`, () => {
        expect(parse(`// foo
instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}`, 4)).to.equal(`// foo
instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}`);
    });
    
    it(`twos instance with pub def`, () => {
        expect(parse(`instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}`, 4)).to.equal(`instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}`);
    });


    
    it(`lawless class with pub def`, () => {
        expect(parse(`///
/// A type class for addition.
///
pub lawless class Add[a] {
    ///
    /// Returns the sum of \`x\` and \`y\`.
    ///
    pub def add(x: a, y: a): a
}`, 4)).to.equal(`///
/// A type class for addition.
///
pub lawless class Add[a] {
    ///
    /// Returns the sum of \`x\` and \`y\`.
    ///
    pub def add(x: a, y: a): a
}`);
    });

    it(`instance with longer method `, () => {
        expect(parse(`instance Add[String] {
    pub def add(x: String, y: String): String =
        import java.lang.String.concat(String);
        (x \`concat\` y) as & Pure
}`, 4)).to.equal(`instance Add[String] {
    pub def add(x: String, y: String): String =
        import java.lang.String.concat(String);
        (x \`concat\` y) as & Pure
}`);
    });

});