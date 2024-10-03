import { vi, describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { transpose } from '../src/util';

describe('something truthy and falsy', () => {
    it('true to be true', () => {
        expect(true).toBe(true);
    });

    it('false to be false', () => {
        expect(false).toBe(false);
    });
});

describe('Testing I can pull from util', () =>{
    it('just the same 2D array to be equal', () => {
        expect([[1,2,3],[4,5,6],[7,8,9]]).toEqual([[1,2,3],[4,5,6],[7,8,9]]);
    });


    it('Simple transpose to be equal', () => {
        expect(transpose([[1,2,3],[4,5,6],[7,8,9]])).toEqual([[1,4,7],[2,5,8],[3,6,9]]);
    });
});

//I'm going to need to make some tests where I can set what's in the grid, and try out moves at certain breakpoints.