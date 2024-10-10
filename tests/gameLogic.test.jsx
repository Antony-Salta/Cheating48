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
        expect(Game.calcOrientation(layout)).toBe('NEW');
    });
    it('Testing it in the NES direction', () =>{
        let layout = [
            [null,2,4,32],
            [null,null,8,32],
            [null,null,null,null],
            [null,null,null,null]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('NES');
    });
    it('Testing it in the NWS direction', () =>{
        let layout = [
            [128,2,4,null],
            [4,16,8,null],
            [null,null,null,null],
            [null,null,null,null]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('NWS');
    });
    it('Testing it in the NWE direction', () =>{
        let layout = [
            [128,64,16,8],
            [4,16,8,null],
            [null,null,null,null],
            [null,null,null,null]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('NWE');
    });
    it('Testing it in the SWN direction', () =>{
        let layout = [
            [2,4,16,8],
            [4,16,8,null],
            [64,null,null,null],
            [128,32,null,null]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('SWN');
    });
    it('Testing it in the SWE direction', () =>{
        let layout = [
            [null,4,16,8],
            [4,16,8,null],
            [8,null,null,null],
            [128,64,16,null]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('SWE');
    });
    it('Testing it in the SEW direction', () =>{
        let layout = [
            [null,null,null,null],
            [null,null,null,null],
            [16,8,4,4],
            [32,64,128,256]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('SEW');
    });
    it('Testing it in the SEN direction', () =>{
        let layout = [
            [null,null,null,null],
            [null,null,null,16],
            [null,null,null,64],
            [null,null,32,256]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('SEN');
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
        
        expect(Game.calcOrientation(layout)).toBe('NEW');
    });
    it('Testing it in the NW corner, expect to be NWS', () =>{
        let layout = [
            [64,16,16,32],
            [16,null,8,16],
            [null,null,null,null],
            [null,null,null,null]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('NWS');
    });
    it('Testing it in the SW corner, expect to be SWN', () =>{
        let layout = [
            [null,null,null,null],
            [8,null,null,null],
            [32,null,null,null],
            [128,32,2,4]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('SWN');
    });
    it('Testing it in the SE corner, expect to be SEW', () =>{
        let layout = [
            [null,null,null,32],
            [null,null,null,64],
            [null,null,null,128],
            [null,null,128,256]
        ];
        
        expect(Game.calcOrientation(layout)).toBe('SEW');
    });
});

describe('Testing convertLayout makes all layouts convert to be NEW', () => {
    let baseLayout = [
        [128,256,512,1024],
        [64,32,16,8],
        [null,null,null,4],
        [null,null,null,null]
    ]; // This is the layout that everything should be converted to, and I will make the different versions for each orientation.
    it('Testing that the base layout has an orientation of NEW', () => {
        expect(Game.calcOrientation(baseLayout)).toBe('NEW');
    });
    
    it('Testing NEW conversion (the same as the base version)', () =>{
        let layout = [
            [128,256,512,1024],
            [64,32,16,8],
            [null,null,null,4],
            [null,null,null,null]
        ];
        
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation, layout);
        expect(convert).toEqual(baseLayout);
    });
    it('Testing NES conversion', () =>{
        let layout = [
            [null,4,8,1024],
            [null,null,16,512],
            [null,null,32,256],
            [null,null,64,128]
        ];
        
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation, layout);
        expect(convert).toEqual(baseLayout);
    });
    it('Testing SEN conversion', () =>{
        let layout = [
            [null,null,64,128],
            [null,null,32,256],
            [null,null,16,512],
            [null,4,8,1024]
        ];
        
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation, layout);
        expect(convert).toEqual(baseLayout);
    });
    it('Testing SEW conversion', () =>{
        let layout = [
            [null,null,null,null],
            [null,null,null,4],
            [64,32,16,8],
            [128,256,512,1024]
        ];
        
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation, layout);
        expect(convert).toEqual(baseLayout);
    });
    it('Testing SWE conversion', () =>{
        let layout = [
            [null,null,null,null],
            [4,null,null,null],
            [8,16,32,64],
            [1024,512,256,128]
        ];
        
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation, layout);
        expect(convert).toEqual(baseLayout);
    });
    it('Testing SWN conversion', () =>{
        let layout = [
            [128,64,null,null],
            [256,32,null,null],
            [512,16,null,null],
            [1024,8,4,null]
        ];
        
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation, layout);
        expect(convert).toEqual(baseLayout);
    });
    it('Testing NWS conversion', () =>{
        let layout = [
            [1024,8,4,null],
            [512,16,null,null],
            [256,32,null,null],
            [128,64,null,null]
        ];
        
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation, layout);
        expect(convert).toEqual(baseLayout);
    });
    it('Testing NWE conversion', () =>{
        let layout = [
            [1024,512,256,128],
            [8,16,32,64],
            [4,null,null,null],
            [null,null,null,null]
        ];
        
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation, layout);
        expect(convert).toEqual(baseLayout);
    });
});

describe('Testing convertBack makes all layouts convert to be the orientation that they were', () => {
    
    let baseLayout = [
        [128,256,512,1024],
        [64,32,16,8],
        [null,null,null,4],
        [null,null,null,null]
    ]; // this is the layout that they will all start as, and tehy'll be converted to their own ones.

    it('Testing NEW conversion (the same as the base version)', () =>{
        let original = [
            [128,256,512,1024],
            [64,32,16,8],
            [null,null,null,4],
            [null,null,null,null]
        ];
        
        let convert = Game.convertBack('NEW', baseLayout)
        expect(convert).toEqual(original);
    });
    it('Testing NES conversion', () =>{
        let original = [
            [null,4,8,1024],
            [null,null,16,512],
            [null,null,32,256],
            [null,null,64,128]
        ];
        
        let convert = Game.convertBack('NES', baseLayout)
        expect(convert).toEqual(original);
    });
    it('Testing SEN conversion', () =>{
        let original = [
            [null,null,64,128],
            [null,null,32,256],
            [null,null,16,512],
            [null,4,8,1024]
        ];
        
        let convert = Game.convertBack('SEN', baseLayout)
        expect(convert).toEqual(original);
    });
    it('Testing SEW conversion', () =>{
        let original = [
            [null,null,null,null],
            [null,null,null,4],
            [64,32,16,8],
            [128,256,512,1024]
        ];
        
        let convert = Game.convertBack('SEW', baseLayout)
        expect(convert).toEqual(original);
    });
    it('Testing SWE conversion', () =>{
        let original = [
            [null,null,null,null],
            [4,null,null,null],
            [8,16,32,64],
            [1024,512,256,128]
        ];
        
        let convert = Game.convertBack('SWE', baseLayout)
        expect(convert).toEqual(original);
    });
    it('Testing SWN conversion', () =>{
        let original = [
            [128,64,null,null],
            [256,32,null,null],
            [512,16,null,null],
            [1024,8,4,null]
        ];
        
        let convert = Game.convertBack('SWN', baseLayout)
        expect(convert).toEqual(original);
    });
    it('Testing NWS conversion', () =>{
        let original = [
            [1024,8,4,null],
            [512,16,null,null],
            [256,32,null,null],
            [128,64,null,null]
        ];
        
        let convert = Game.convertBack('NWS', baseLayout)
        expect(convert).toEqual(original);
    });
    it('Testing NWE conversion', () =>{
        let original = [
            [1024,512,256,128],
            [8,16,32,64],
            [4,null,null,null],
            [null,null,null,null]
        ];
        
        let convert = Game.convertBack('NWE', baseLayout)
        expect(convert).toEqual(original);
    });
});

/**
 * In general, the pattern for what the "original" coords are is putting the [0,3] coord and the end that it trails to [0,0]
 * From there you can build the grid and just fill in the coordinates.
 * But for some reason the NWS orientation doesn't fit this pattern, but the grid for it still makes sense.
 * Not sure why the pattern holds for all but NWS. As is, NWS's grid is actually the same as SEN, the complete opposite, a reflection in both the x and y axis.
 */
describe('Testing convertCoords makes all coordinates go from where they would be in a NEW orientation to where they would be in the original orientation', () => {
    
    let baseCoords =   [[0,0],[0,1],[0,2],[0,3],
                        [1,0],[1,1],[1,2],[1,3],
                        [2,0],[2,1],[2,2],[2,3],
                        [3,0],[3,1],[3,2],[3,3]
    ]; // this is the layout that they will all start as, and they'll be converted to their own ones.

    it('Testing NEW conversion (the same as the base version)', () =>{
        let original = [[0,0],[0,1],[0,2],[0,3],
                        [1,0],[1,1],[1,2],[1,3],
                        [2,0],[2,1],[2,2],[2,3],
                        [3,0],[3,1],[3,2],[3,3]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('NEW',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing NES conversion', () =>{
        let original = [[3,3],[2,3],[1,3],[0,3],
                        [3,2],[2,2],[1,2],[0,2],
                        [3,1],[2,1],[1,1],[0,1],
                        [3,0],[2,0],[1,0],[0,0]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('NES',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing SEN conversion', () =>{
        let original = [[3,0],[2,0],[1,0],[0,0],
                        [3,1],[2,1],[1,1],[0,1],
                        [3,2],[2,2],[1,2],[0,2],
                        [3,3],[2,3],[1,3],[0,3]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('SEN',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing SEW conversion', () =>{
        let original = [[3,0],[3,1],[3,2],[3,3],
                        [2,0],[2,1],[2,2],[2,3],
                        [1,0],[1,1],[1,2],[1,3],
                        [0,0],[0,1],[0,2],[0,3]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('SEW',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing SWE conversion', () =>{
        let original = [[3,3],[3,2],[3,1],[3,0],
                        [2,3],[2,2],[2,1],[2,0],
                        [1,3],[1,2],[1,1],[1,0],
                        [0,3],[0,2],[0,1],[0,0]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('SWE',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing SWN conversion', () =>{
        let original = [[0,0],[1,0],[2,0],[3,0],
                        [0,1],[1,1],[2,1],[3,1],
                        [0,2],[1,2],[2,2],[3,2],
                        [0,3],[1,3],[2,3],[3,3]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('SWN',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });

    it('Testing NWS conversion', () =>{
        // This one is special, because you don't line it up as if [0,3] is the highest number and trail down to [0,0]. Still trying to figure out why it doesn't follow the pattern of the other ones, but this is definitely what it should be in terms of conversion
        let original = [[3,0],[2,0],[1,0],[0,0],
                        [3,1],[2,1],[1,1],[0,1],
                        [3,2],[2,2],[1,2],[0,2],
                        [3,3],[2,3],[1,3],[0,3]
        ];
        
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('NWS',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
        
    });
    it('Testing NWE conversion', () =>{
        let original = [[0,3],[0,2],[0,1],[0,0],
                        [1,3],[1,2],[1,1],[1,0],
                        [2,3],[2,2],[2,1],[2,0],
                        [3,3],[3,2],[3,1],[3,0]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('NWE',baseCoords[i], Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
});


describe('Testing convertCoords makes all coordinates go from where they would be in a NEW orientation to where they would be in the original orientation', () => {
    
    let baseCoords =   [[0,0],[0,1],[0,2],[0,3],
                        [1,0],[1,1],[1,2],[1,3],
                        [2,0],[2,1],[2,2],[2,3],
                        [3,0],[3,1],[3,2],[3,3]
    ]; // this is the layout that they will all start as, and they'll be converted to their own ones.

    it('Testing NEW conversion (the same as the base version)', () =>{
        let original = [[0,0],[0,1],[0,2],[0,3],
                        [1,0],[1,1],[1,2],[1,3],
                        [2,0],[2,1],[2,2],[2,3],
                        [3,0],[3,1],[3,2],[3,3]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('NEW',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing NES conversion', () =>{
        let original = [[3,3],[2,3],[1,3],[0,3],
                        [3,2],[2,2],[1,2],[0,2],
                        [3,1],[2,1],[1,1],[0,1],
                        [3,0],[2,0],[1,0],[0,0]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('NES',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing SEN conversion', () =>{
        let original = [[3,0],[2,0],[1,0],[0,0],
                        [3,1],[2,1],[1,1],[0,1],
                        [3,2],[2,2],[1,2],[0,2],
                        [3,3],[2,3],[1,3],[0,3]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('SEN',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing SEW conversion', () =>{
        let original = [[3,0],[3,1],[3,2],[3,3],
                        [2,0],[2,1],[2,2],[2,3],
                        [1,0],[1,1],[1,2],[1,3],
                        [0,0],[0,1],[0,2],[0,3]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('SEW',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing SWE conversion', () =>{
        let original = [[3,3],[3,2],[3,1],[3,0],
                        [2,3],[2,2],[2,1],[2,0],
                        [1,3],[1,2],[1,1],[1,0],
                        [0,3],[0,2],[0,1],[0,0]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('SWE',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
    it('Testing SWN conversion', () =>{
        let original = [[0,0],[1,0],[2,0],[3,0],
                        [0,1],[1,1],[2,1],[3,1],
                        [0,2],[1,2],[2,2],[3,2],
                        [0,3],[1,3],[2,3],[3,3]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('SWN',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });

    it('Testing NWS conversion', () =>{
        // This one is special, because you don't line it up as if [0,3] is the highest number and trail down to [0,0]. Still trying to figure out why it doesn't follow the pattern of the other ones, but this is definitely what it should be in terms of conversion
        let original = [[3,0],[2,0],[1,0],[0,0],
                        [3,1],[2,1],[1,1],[0,1],
                        [3,2],[2,2],[1,2],[0,2],
                        [3,3],[2,3],[1,3],[0,3]
        ];
        
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('NWS',baseCoords[i],Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
        
    });
    it('Testing NWE conversion', () =>{
        let original = [[0,3],[0,2],[0,1],[0,0],
                        [1,3],[1,2],[1,1],[1,0],
                        [2,3],[2,2],[2,1],[2,0],
                        [3,3],[3,2],[3,1],[3,0]
        ];
        let comparison = Array(baseCoords.length);
        for (let i = 0; i < baseCoords.length; i++) {
            comparison[i] = Game.convertCoords('NWE',baseCoords[i], Math.sqrt(baseCoords.length)); 
        }
        
        expect(comparison).toEqual(original);
    });
});

let genFreeSpaces = (layout) =>
    {
        let freeSpaces =[];
        for (let i = 0; i < layout.length; i++) {
            for (let j = 0; j < layout[0].length; j++) {
                let num = layout[i][j];
                if(num === null)
                {
                    freeSpaces.push([i,j]);
                }
            } 
        }
        return freeSpaces;
    }

describe('Testing the StopBlocks method', () =>{
    
    
    it('testing an example where it should discourage a spawn, with just one row',()=>{
        let layout = [
            [null,8,128,256],
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null]
            ];
        let game = new Game(layout);
        let freeSpaces = genFreeSpaces(layout);
        expect(freeSpaces).toStrictEqual([[0,0],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopBlocks(layout,freeSpaces,discouraged,genNumber);
        let expectedCoords = [0,0];
        //remember that discouraged is an array, of arrays of coords. and coords are themselves an array of length 2.
        expect(discouraged).toStrictEqual([[expectedCoords]]);
        expect(freeSpaces).toStrictEqual([[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);

    });
    it('testing an example where it should discourage a spawn, with two rows',()=>{
        let layout = [
            [16,8,128,256],
            [8,16,null,8],
            [null,null,null,null],
            [null,null,null,null]
            ];
        let game = new Game(layout);
        let freeSpaces = genFreeSpaces(layout);
        expect(freeSpaces).toStrictEqual([[1,2],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopBlocks(layout,freeSpaces,discouraged,genNumber);
        let expectedCoords = [1,2];
         
        expect(discouraged).toStrictEqual([[expectedCoords]]);
        expect(freeSpaces).toStrictEqual([[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]); //It's removed the free space that was there

    });
    it('testing an example where it should discourage a spawn, with three rows',()=>{
        let layout = [
            [16,8,128,256],
            [8,16,8,16],
            [16,8,16,null],
            [null,null,null,null]
            ];
        let game = new Game(layout);
        let freeSpaces = genFreeSpaces(layout);
        expect(freeSpaces).toStrictEqual([[2,3],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopBlocks(layout,freeSpaces,discouraged,genNumber);
        let expectedCoords = [2,3];
         
        expect(discouraged).toStrictEqual([[expectedCoords]]);
        expect(freeSpaces).toStrictEqual([[3,0],[3,1],[3,2],[3,3]]);

    });
    it('testing an example where it should discourage a spawn, with 2 rows and after converting from NWS orientation',()=>{
        let layout = [
            [256,8   ,null,null],
            [128,null,null,null],
            [8  ,16  ,null,null],
            [16 ,8   ,null,null]
            ];
        let game = new Game(layout);
        let orientation = Game.calcOrientation(layout);
        let convert = Game.convertLayout(orientation,layout);
        let freeSpaces = genFreeSpaces(convert);
        expect(freeSpaces).toStrictEqual([[1,2],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);// fun of the conversions being done
        let discouraged = [];
        let genNumber = 2;
        game.stopBlocks(convert,freeSpaces,discouraged,genNumber);
        let expectedCoords = [1,2]; // this looks stupid, but it will be converted so it will be different.
         
        expect(discouraged).toStrictEqual([[expectedCoords]]);
        expect(freeSpaces).toStrictEqual([[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);
        expect(Game.convertCoords(orientation,discouraged[0][0],layout.length)).toStrictEqual([1,1]);
        expect(orientation).toBe("NWS");

    });

});

describe('Testing the StopRowLeft method', () =>{
    
    
    
    it('testing an example where it should discourage just 1 spawn in the bottom right corner.',()=>{
        let layout = [
            [null,8,128,256],
            [null,null,null,2],
            [null,null,null,4],
            [null,null,null,null]
            ];
        let game = new Game(layout);
        let freeSpaces = genFreeSpaces(layout);
        expect(freeSpaces).toStrictEqual([[0,0],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopRowLeft(layout,freeSpaces,discouraged,genNumber);
        let expectedCoords = [3,3];
        //remember that discouraged is an array, of arrays of coords. and coords are themselves an array of length 2.
        expect(discouraged).toStrictEqual([[expectedCoords]]);
        expect(freeSpaces).toStrictEqual([[0,0],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2]]);

    });
   
    it('testing an example where it should discourage just 1 spawn in the top right corner from NWS orientation.',()=>{
        let layout = [
            [256,2,4,null],
            [128,null,null,null],
            [8,null,null,null],
            [null,null,null,null]
            ];
        let orientation = Game.calcOrientation(layout);
        expect(orientation).toEqual("NWS");
        let convert = Game.convertLayout(orientation,layout);
        let game = new Game(convert);
        let freeSpaces = genFreeSpaces(convert);
        //This is the converted stuff, which should be the same as the test above, if left unedited, since I just converted that layout
        expect(freeSpaces).toStrictEqual([[0,0],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopRowLeft(convert,freeSpaces,discouraged,genNumber);
        let expectedCoords = [3,3];
        //remember that discouraged is an array, of arrays of coords. and coords are themselves an array of length 2.
        expect(discouraged).toStrictEqual([[expectedCoords]]);
        expect(freeSpaces).toStrictEqual([[0,0],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2]]);
        expect(Game.convertCoords(orientation,discouraged[0][0],convert.length)).toStrictEqual([0,3])
    });
    
    it("testing an example where it should be discouraging spawns that don't allow a left or upward move.",()=>{
        let layout = [
            [8,16,128,256],
            [16,8,16,null],
            [8,null,null,null],
            [null,null,null,null]
            ];
        let game = new Game(layout);
        let freeSpaces = genFreeSpaces(layout);
        expect(freeSpaces).toStrictEqual([[1,3],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopRowLeft(layout,freeSpaces,discouraged,genNumber);
        let expectedCoords = [[2,1],[3,0]];
        //remember that discouraged is an array, of arrays of coords. and coords are themselves an array of length 2.
        expect(discouraged).toStrictEqual([expectedCoords]);
        expect(freeSpaces).toStrictEqual([[1,3],[2,2],[2,3],[3,1],[3,2],[3,3]]);

    });

    it('testing an example with an ambiguous orientation (should be NEW).',()=>{
        let layout = [
            [null,  8,  4,  8],
            [null,null,null,4],
            [null,null,null,2],
            [null,null,null,null]
            ];
        let orientation = Game.calcOrientation(layout);
        expect(orientation).toEqual("NEW");
        let convert = Game.convertLayout(orientation,layout);
        let game = new Game(convert);
        let freeSpaces = genFreeSpaces(convert);
        expect(freeSpaces).toStrictEqual([[0,0],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopRowLeft(convert,freeSpaces,discouraged,genNumber);
        let expectedCoords = [1,2];
        //remember that discouraged is an array, of arrays of coords. and coords are themselves an array of length 2.
        expect(discouraged).toStrictEqual([[expectedCoords]]);
        expect(freeSpaces).toStrictEqual([[0,0],[1,0],[1,1],[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[3,3]]);

    });

    it("testing an example With 2 filled rows and nothing else, so stopping any spawn that doesn't allow a rightward move.",()=>{
        let layout = [
            [512,1024,2048,4096],
            [256,128,64,32],
            [null,null,null,null],
            [null,null,null,null]
            ];
        let game = new Game(layout);
        let freeSpaces = genFreeSpaces(layout);
        expect(freeSpaces).toStrictEqual([[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopRowLeft(layout,freeSpaces,discouraged,genNumber);
        let expectedCoords = [2,3];
        //remember that discouraged is an array, of arrays of coords. and coords are themselves an array of length 2.
        expect(discouraged).toStrictEqual([[expectedCoords]]);
        expect(freeSpaces).toStrictEqual([[2,0],[2,1],[2,2],[3,0],[3,1],[3,2],[3,3]]);

    });
    

});
describe("Testing stopBlocks and stopRowLeft being done together", ()=>{
    it("Testing an example where stopRowLeft would allow a tile to be placed, but stopBlock would stop it.", ()=>{
        let layout = [
            [512,1024,2048,4096],
            [256,128,64,null],
            [null,null,null,null],
            [null,null,null,null]
            ];
        let game = new Game(layout);
        let freeSpaces = genFreeSpaces(layout);
        expect(freeSpaces).toStrictEqual([[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);
        let discouraged = [];
        let genNumber = 2;
        game.stopRowLeft(layout,freeSpaces,discouraged,genNumber);
        let expectedCoords = [[[2,0]]];
        //remember that discouraged is an array, of arrays of coords. and coords are themselves an array of length 2.
        expect(discouraged).toStrictEqual(expectedCoords);
        expect(freeSpaces).toStrictEqual([[1,3],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);

        expectedCoords.push([[1,3]]);
        game.stopBlocks(layout,freeSpaces,discouraged,genNumber);
        expect(discouraged).toStrictEqual(expectedCoords);
        expect(freeSpaces).toStrictEqual([[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]);

    });
});

