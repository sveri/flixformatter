import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('Types Indentation should remain the same for: ', () => {
    it(`class without types Add`, () => {
    expect(parse(`pub lawless class Add {
    pub def add(x: a, y: a): a
}`, 4)).to.equal(`pub lawless class Add {
    pub def add(x: a, y: a): a
}`);
    });
    it(`class with sohpisticated types Add[m: Type -> Type]`, () => {
        expect(parse(`pub lawless class Add[m: Type -> Type] {
    pub def add(x: a, y: a): a
}`, 4)).to.equal(`pub lawless class Add[m: Type -> Type] {
    pub def add(x: a, y: a): a
}`);
    });

    it(`class with method sohpisticated types pub def ap(f: m[a -> b]): m`, () => {
        expect(parse(`pub lawless class Add[m: Type -> Type] {
    pub def ap(f: m[a -> b]): m
}`, 4)).to.equal(`pub lawless class Add[m: Type -> Type] {
    pub def ap(f: m[a -> b]): m
}`);
    });

    it(`class with method multiple sohpisticated types pub def ap(f: m[a -> b]): m`, () => {
        expect(parse(`pub lawless class Add[m: Type -> Type] {
    pub def ap(f: m[a -> b], e: m[a -> b]): m
}`, 4)).to.equal(`pub lawless class Add[m: Type -> Type] {
    pub def ap(f: m[a -> b], e: m[a -> b]): m
}`);
    });

    it(`class with method sohpisticated types "& e" pub def ap(f: m[a -> b & e]): m`, () => {
        expect(parse(`pub lawless class Add[m: Type -> Type] {
    pub def ap(f: m[a -> b & e]): m
}`, 4)).to.equal(`pub lawless class Add[m: Type -> Type] {
    pub def ap(f: m[a -> b & e]): m
}`);

    });
    it(`method with bracket return types point(x: a): m[a]`, () => {
        expect(parse(`pub class Add {
    pub def point(x: a): m[a]
}`, 4)).to.equal(`pub  class Add {
    pub def point(x: a): m[a]
}`);
    });

});