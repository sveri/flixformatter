import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('Namespace Indentation should remain the same for: ', () => {
    it(`namespace with pub def`, () => {
        expect(parse(`namespace Array {
    pub def add(x: a, y: a): a
}`, 4)).to.equal(`namespace Array {
    pub def add(x: a, y: a): a
}`);
    });
});