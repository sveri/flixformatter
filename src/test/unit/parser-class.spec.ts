import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('Class Indentation should remain the same for: ', () => {    
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
});