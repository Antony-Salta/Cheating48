import { vi, describe, it, expect } from 'vitest';
import { transpose, copy2DArray } from '../src/util';


describe('Testing transpose', () =>{
    it('just the same 2D array to be equal', () => {
        expect([[1,2,3],[4,5,6],[7,8,9]]).toEqual([[1,2,3],[4,5,6],[7,8,9]]);
    });


    it('Simple transpose to be equal', () => {
        expect(transpose([[1,2,3],[4,5,6],[7,8,9]])).toEqual([[1,4,7],[2,5,8],[3,6,9]]);
    });
});

describe('Testing copy2DArray', () =>{
    let array2D = [[1,2,3],[4,5,6],[7,8,9]];
    it('A copied 2D array to not be === to the original', () =>{
        expect(copy2DArray(array2D) === array2D).toBe(false);
    });

    it('A copied 2D array to have the same contents as the original.', () =>{
        expect(copy2DArray(array2D)).toEqual(array2D);
    });
});

//I'm going to need to make some tests where I can set what's in the grid, and try out moves at certain breakpoints.