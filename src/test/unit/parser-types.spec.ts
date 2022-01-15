import { expect } from 'chai';
import { parse } from '../../formatter/jsParser';


describe('Types Indentation should remain the same for: ', () => {
    // it(`andType types b: Float32`, () => {
    //     expect(parse(`b: Float32`, 4)).to.equal(`b: Float32`);
    // });
    // it(`andType types a -> b`, () => {
    //     expect(parse(`a: m[a -> b]`, 4)).to.equal(`a: m[a -> b]`);
    // });
    // it(`andType types & e`, () => {
    //     expect(parse(`a: m[a -> b & e]`, 4)).to.equal(`a: m[a -> b& e]`);
    // });



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

});