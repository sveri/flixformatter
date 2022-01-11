import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('Types Indentation should remain the same for: ', () => {
    it(`class with sohpisticated types`, () => {
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

    it(`class with method sohpisticated types "& e" pub def ap(f: m[a -> b & e]): m`, () => {
        expect(parse(`pub lawless class Add[m: Type -> Type] {
    pub def ap(f: m[a -> b & e]): m
}`, 4)).to.equal(`pub lawless class Add[m: Type -> Type] {
    pub def ap(f: m[a -> b & e]): m
}`);
    });

});