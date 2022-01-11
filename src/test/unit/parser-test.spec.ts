import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('Indentation should remain the same for: ', () => {
    it(`single instance with pub def`, () => {
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
    
    it(`two instances with pub def`, () => {
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

    it(`comment, lawless class and instance`, () => {
        expect(parse(`/*
*  http://www.apache.org/licenses/LICENSE-2.0
*/
///
/// A type class for addition.
///
pub lawless class Add[a] {
    ///
    /// Returns the sum of \`x\` and \`y\`.
    ///
    pub def add(x: a, y: a): a
}

instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}`, 4)).to.equal(`/*
*  http://www.apache.org/licenses/LICENSE-2.0
*/
///
/// A type class for addition.
///
pub lawless class Add[a] {
    ///
    /// Returns the sum of \`x\` and \`y\`.
    ///
    pub def add(x: a, y: a): a
}

instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}`);
    });
});