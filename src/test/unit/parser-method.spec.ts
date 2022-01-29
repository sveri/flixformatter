import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('Indentation should remain the same for: ', () => {

    it(`method with class function call`, () => {
        expect(parse(`class Applicative[m: Type -> Type] with Functor[m] {
    pub def liftA2(f: t1 -> t2 -> r & e, x1: m[t1], x2: m[t2]): m[r] & e = Applicative.ap(Functor.map(f, x1), x2)
}`, 4)).to.equal(`class Applicative[m: Type -> Type] with Functor[m] {
    pub def liftA2(f: t1 -> t2 -> r & e, x1: m[t1], x2: m[t2]): m[r] & e = Applicative.ap(Functor.map(f, x1), x2)
}`);
    });
});