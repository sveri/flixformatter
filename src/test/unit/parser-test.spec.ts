import { expect } from 'chai';
import { parse } from '../../formatter/parser';


describe('Indentation should remain the same for: ', () => {
    it(`one single line comment`, () => {

        expect(parse(`//\n`, 4)).to.equal("//");
    });
    it(`single line commens with one word`, () => {
        expect(parse("//asffoo\r\n", 4)).to.equal("//asffoo");
    });
    it(`single line comment with spaced text`, () => {
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


    it(`single instance with pub def`, () => {
        expect(parse(`instance Add[Float32] {
    pub def add()
}`, 4)).to.equal(`instance Add[Float32] {
    pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
}`);
    });

//     it(`single instance with pub def`, () => {
//         expect(parse(`instance Add[Float32] {
//     pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
// }`, 4)).to.equal(`instance Add[Float32] {
//     pub def add(x: Float32, y: Float32): Float32 = $FLOAT32_ADD$(x, y)
// }`);
//     });

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

    it(`comment, lawless class and `, () => {
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
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
}

instance Add[Float64] {
    pub def add(x: Float64, y: Float64): Float64 = $FLOAT64_ADD$(x, y)
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
}

instance Add[Int8] {
    pub def add(x: Int8, y: Int8): Int8 = $INT8_ADD$(x, y)
}

instance Add[Int16] {
    pub def add(x: Int16, y: Int16): Int16 = $INT16_ADD$(x, y)
}

instance Add[Int32] {
    pub def add(x: Int32, y: Int32): Int32 = $INT32_ADD$(x, y)
}

instance Add[Int64] {
    pub def add(x: Int64, y: Int64): Int64 = $INT64_ADD$(x, y)
}

instance Add[BigInt] {
    pub def add(x: BigInt, y: BigInt): BigInt = $BIGINT_ADD$(x, y)
}

instance Add[String] {
    pub def add(x: String, y: String): String =
        import java.lang.String.concat(String);
        (x \`concat\` y) as & Pure
}`);
    });

});