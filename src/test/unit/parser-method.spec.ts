import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('method Indentation should remain the same for: ', () => {

    it(`method with class function call`, () => {
        expect(parse(`class Applicative[m: Type -> Type] with Functor[m] {
    pub def liftA2(f: t1 -> t2 -> r & e, x1: m[t1], x2: m[t2]): m[r] & e = Applicative.ap(Functor.map(f, x1), x2)
}`, 4)).to.equal(`class Applicative[m: Type -> Type] with Functor[m] {
    pub def liftA2(f: t1 -> t2 -> r & e, x1: m[t1], x2: m[t2]): m[r] & e = Applicative.ap(Functor.map(f, x1), x2)
}`);
    });

    it(`method with class with long function call`, () => {
        expect(parse(`class Applicative[m: Type -> Type] with Functor[m] {
    pub def liftA5(f: t1 -> t2 -> t3 -> t4 -> t5 -> r & e, x1: m[t1], x2: m[t2], x3: m[t3], x4: m[t4], x5: m[t5]): m[r] & e = Applicative.ap(Applicative.liftA4(f, x1, x2, x3, x4), x5)
}`, 4)).to.equal(`class Applicative[m: Type -> Type] with Functor[m] {
    pub def liftA5(f: t1 -> t2 -> t3 -> t4 -> t5 -> r & e, x1: m[t1], x2: m[t2], x3: m[t3], x4: m[t4], x5: m[t5]): m[r] & e =
        Applicative.ap(Applicative.liftA4(f, x1, x2, x3, x4), x5)
}`);
    });
});