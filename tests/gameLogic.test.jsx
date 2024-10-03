import { vi, describe, it, expect } from 'vitest';
import { transpose } from '../src/util';
import { Game } from '../src/gameLogic';


describe('Testing I can pull from util', () =>{
    it('just the same 2D array to be equal', () => {
        expect([[1,2,3],[4,5,6],[7,8,9]]).toEqual([[1,2,3],[4,5,6],[7,8,9]]);
    });


    it('Simple transpose to be equal', () => {
        expect(transpose([[1,2,3],[4,5,6],[7,8,9]])).toEqual([[1,4,7],[2,5,8],[3,6,9]]);
    });
});

describe('Testing the calcOrientation method with obvious cases', () => {
    it('Testing it in the NEW direction', () =>{
        let layout = [
            [null,2,16,32],
            [null,null,8,8],
            [null,null,null,null],
            [null,null,null,null]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('NEW');
    });
    it('Testing it in the NES direction', () =>{
        let layout = [
            [null,2,4,32],
            [null,null,8,32],
            [null,null,null,null],
            [null,null,null,null]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('NES');
    });
    it('Testing it in the NWS direction', () =>{
        let layout = [
            [128,2,4,null],
            [4,16,8,null],
            [null,null,null,null],
            [null,null,null,null]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('NWS');
    });
    it('Testing it in the NWE direction', () =>{
        let layout = [
            [128,64,16,8],
            [4,16,8,null],
            [null,null,null,null],
            [null,null,null,null]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('NWE');
    });
    it('Testing it in the SWN direction', () =>{
        let layout = [
            [2,4,16,8],
            [4,16,8,null],
            [64,null,null,null],
            [128,32,null,null]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('SWN');
    });
    it('Testing it in the SWE direction', () =>{
        let layout = [
            [null,4,16,8],
            [4,16,8,null],
            [8,null,null,null],
            [128,64,16,null]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('SWE');
    });
    it('Testing it in the SEW direction', () =>{
        let layout = [
            [null,null,null,null],
            [null,null,null,null],
            [16,8,4,4],
            [32,64,128,256]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('SEW');
    });
    it('Testing it in the SEN direction', () =>{
        let layout = [
            [null,null,null,null],
            [null,null,null,16],
            [null,null,null,64],
            [null,null,32,256]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('SEN');
    });
});

describe('Testing calcOrientation with equal values on the sides', () => {
    it('Testing it in the NE corner, expect to be NEW', () =>{
        let layout = [
            [null,2,16,32],
            [null,null,8,16],
            [null,null,null,null],
            [null,null,null,null]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('NEW');
    });
    it('Testing it in the NW corner, expect to be NWS', () =>{
        let layout = [
            [64,16,16,32],
            [16,null,8,16],
            [null,null,null,null],
            [null,null,null,null]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('NWS');
    });
    it('Testing it in the SW corner, expect to be SWN', () =>{
        let layout = [
            [null,null,null,null],
            [8,null,null,null],
            [32,null,null,null],
            [128,32,2,4]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('SWN');
    });
    it('Testing it in the SE corner, expect to be SEW', () =>{
        let layout = [
            [null,null,null,32],
            [null,null,null,64],
            [null,null,null,128],
            [null,null,128,256]
        ];
        let game = new Game(layout);
        expect(game.calcOrientation()).toBe('SEW');
    });
});

//I'm going to need to make some tests where I can set what's in the grid, and try out moves at certain breakpoints.