import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('law Indentation should remain the same for: ', () => {

    it(`class with law`, () => {
        expect(parse(`class Applicative[m: Type -> Type] with Functor[m] {
    law identity: forall(x: m[a]) with Eq[m[a]] . Applicative.ap(Applicative.point(identity), x) == x
}`, 4)).to.equal(`class Applicative[m: Type -> Type] with Functor[m] {
    law identity: forall(x: m[a]) with Eq[m[a]] . Applicative.ap(Applicative.point(identity), x) == x
}`);
    });

    it(`class with law with function call`, () => {
        expect(parse(`class Applicative[m: Type -> Type] with Functor[m] {
    law composition: forall(f: m[b -> c], g: m[a -> b], v: m[a]) with Eq[m[c]] . Applicative.ap(Applicative.ap(Applicative.ap(Applicative.point((f, g) -> g >> f), f), g), v) == Applicative.ap(f, Applicative.ap(g, v))
}`, 4)).to.equal(`class Applicative[m: Type -> Type] with Functor[m] {
    law composition: forall(f: m[b -> c], g: m[a -> b], v: m[a]) with Eq[m[c]] . Applicative.ap(Applicative.ap(Applicative.ap(Applicative.point((f, g) -> g >> f), f), g), v) == Applicative.ap(f, Applicative.ap(g, v))
}`);
    });

    it(`class with longer law with function call`, () => {
        expect(parse(`class Applicative[m: Type -> Type] with Functor[m] {
    law liftA5Correspondence: forall(f: t1 -> t2 -> t3 -> t4 -> t5 -> r, x1: m[t1], x2: m[t2], x3: m[t3], x4: m[t4], x5: m[t5]) with Eq[m[r]] . Applicative.liftA5(f, x1, x2, x3, x4, x5) == Applicative.ap(Applicative.liftA4(f, x1, x2, x3, x4), x5)
}`, 4)).to.equal(`class Applicative[m: Type -> Type] with Functor[m] {
    law liftA5Correspondence: forall(f: t1 -> t2 -> t3 -> t4 -> t5 -> r, x1: m[t1], x2: m[t2], x3: m[t3], x4: m[t4], x5: m[t5]) with Eq[m[r]] . Applicative.liftA5(f, x1, x2, x3, x4, x5) == Applicative.ap(Applicative.liftA4(f, x1, x2, x3, x4), x5)
}`);    
    });

    it(`class with longer law with function call with function application`, () => {
        expect(parse(`class Applicative[m: Type -> Type] with Functor[m] {
    law interchange: forall(f: m[a -> b], x: a) with Eq[m[b]] . Applicative.ap(f, Applicative.point(x)) == Applicative.ap(Applicative.point(f -> f(x)), f)
}`, 4)).to.equal(`class Applicative[m: Type -> Type] with Functor[m] {
    law interchange: forall(f: m[a -> b], x: a) with Eq[m[b]] . Applicative.ap(f, Applicative.point(x)) == Applicative.ap(Applicative.point(f -> f(x)), f)
}`);    
    });

});