import { copySelection } from "@testing-library/user-event/dist/cjs/document/copySelection.js";
import { copy2DArray, transpose } from "./util";
export class Game{
    constructor(layout)
    {
        //to make it a separate thing according to memory
        let temp = copy2DArray(layout);
        this.layout = temp;
        this._size = layout.length;
        this.startIndex = null;
        this.isAlongCol = null;
        this.multiplier = null;
        this.prevStates = [];
    }

    handleMove(direction)
    {
        let prevLayout = copy2DArray(this.layout);
        //console.log(this.layout); // for some reason this console log looks into the future and prints out the value of the layout at the end of this function.

        this.startIndex = this._size -1; // this gives the starting point to start looking at
        this.isAlongCol = true;
        switch(direction)
        {
            case "left": this.startIndex = 0; this.isAlongCol = false; break;
            case "right": this.isAlongCol = false; break;
            case "up": this.startIndex=0; break;
            case "down":  break;
            default: break;
        }
        this.multiplier = this.startIndex ===0 ? 1 : -1;

        let toPop = {}; // this is essentially going to be a set, checking if the coordinate should be popped or not
        let moveCoords ={};
        moveCoords.isAlongCol = this.isAlongCol;
        moveCoords.direction = -this.multiplier; //the multiplier is opposite for moving compared to what order the list is made in.

        let increase = 0; // this is how much the score should increase by
        for(let i = 0; i < this._size; i++)
        {
            //first off, make a list of the numbers, not including 0, in the order they appear
            //with the first being closest to the edge it is pushed towards. 
            //So if the player goes right and there is a row of 2, 8, 0, 16, the list will be 16, 8, 2
            let line = [];
            let movesNeeded = Array(this._size).fill(0); // this will say how far each item in the line has to move. It will also say that 0 spaces need to move, so that needs to be cut out somewhere here

            for (let j = 0; j < this._size; j++) 
            {
                let val = this.getLayoutSquare(i,j, this.layout);
                if(val !== null)
                {
                    line.push(val);
                    movesNeeded[j] = j - (line.length -1);
                }  
            }
           
            
            let popCoords = []; // this will be used to get the coordinates of each square that should pop at the end of the move.
            //after the line has been made, look to make pairs, go through the list, look at one and the one right after it, and see if they're the same. 
            //If so, replace them in the list and look past both of them. If not, just look past the first one.
            let index = 0;
            while(index < line.length-1)
            {
                if(line[index] === line[index +1])
                {
                    line.splice(index, 2, line[index] * 2);
                    popCoords.push(index);
                    increase += line[index];

                    let hasSkippedFirst = false // this is a weird thing where the first item getting the extra space shouldn't move extra, but you can't know where that square is in the movesNeeded array.
                    for (let j = index; j < this._size; j++) 
                    { // So when a merge happens, everything needs to move along an extra space after the merged square.
                        if(!hasSkippedFirst)
                        {                    
                            if(this.getLayoutSquare(i,j, this.layout) !== null)
                                hasSkippedFirst = true;
        
                            continue;
                        }
                        movesNeeded[j] +=1;
                    }
                }
                index++;
            } 
            
            
            let popIndex =0;
            for (let j = 0; j < this._size; j++) 
            {
                //moveCoords will get all of the old coordinates of the squares that need to move, and by how much
                let coords = this.calcCoords(i,j); 
                if(this.getLayoutSquare(i,j, this.layout) !== null && movesNeeded[j] > 0)
                    moveCoords[coords] = movesNeeded[j];
                
                let newInsertion = j < line.length ? line[j] : null;
                this.layout[coords[0]][coords[1]] = newInsertion;
                
                //so this checks if it has added a square to the layout from the line variable that should be popping when rendering.
                //This is done by seeing if the index of the square popping matches with the index it is currently at as it iterates through the line variable.
                if(popIndex < popCoords.length && popCoords[popIndex] === j)
                {
                    popCoords[popIndex] = coords;
                    popIndex++;
                }
            }
            for (let j = 0; j < popCoords.length; j++) {
                toPop[popCoords[j]] = true;
            }

        }

        let isSame = true;
        let count=0;
        while(isSame && count< this._size)
        {
            let j =0;
            while(isSame && j < this._size)
            {
                if(this.layout[count][j] !== prevLayout[count][j])
                {
                    isSame = false;
                }
                j++;
            }
            count++;
        }
        /*
        for (let i = 0; i < this._size; i++) {
            console.log(this.layout[i]);
            //weird thing where layout looks into the future if I do console.log of the whole 2D array, and it counts the changes made in the next block when generating a new number.
        }
            */
        let newTile = false;
        let gameOver = false;
        if(!isSame) // If it isn't the same, then a move hasn't actually happened
        {
            [newTile, gameOver] = this.generateNewNum();
        }
        this.prevStates.push([prevLayout,increase]);
        while(this.prevStates.length > 3)
            this.prevStates.splice(0,1);

        return [this.layout, {toPop: toPop, newTile: newTile, moveCoords: moveCoords}, increase, gameOver];
    }
    /**
     * 
     * @returns the previous state, which is the layout and the increase that was associated. If there is another state before that, it will also return that, so that the game can know if another undo is possible.
     */
    undo()
    {
        let length = this.prevStates.length;
        console.log(length);
        if(length > 0)
        {
            let newState = this.prevStates.splice(length-1, 1)[0];
            let prevLayout = length > 1 ? this.prevStates[length-2][0] : false;
            this.layout = copy2DArray(newState[0]);
            return [newState, prevLayout];
        }
        else
            return false;
    }

    /**
     * This is going to start simple for now, but there's going to have to be a lot more detection here later
     */
    generateNewNum()
    {
        let genNumber = Math.random() < 0.9 ? 2 : 4;
        
        
        
        let orientation = Game.calcOrientation(this.layout);
        /*TODO:
        - stop big rectangles from being made that can't be merged into itself, because this forces you out of the corner. (It's possible to make it such that the player never has to deal with this, because of how moves and generation works)
        - fill up the row/column that snaking is happening on first/ generate squares that aren't pressed up on the "right", so that you can't make too many moves "right" and be forced to move the main row "left". 
        e.g. snaking NEW and having all squares to the right, but not a full row on the top.
        - if the biggest number isn't in the exact corner, put squares "under" that number so that the player can keep pushing "up", and then "down", keeping the biggest number in place but moving any smaller number actually in the square.
        - change the number generation to be 2 or 4 for sure to allow a move if a game over is close (this would be hard to beyond just looking 1 move ahead).
        */

        //First things first, it's going to be painful to do all of the different indexing possibilities for each of these, so I'm going to make a local layout copy that converts them all into the NEW direction, and then flip back after.
        let convert = Game.convertLayout(orientation, this.layout);
        
        let freeSpaces = [];
        
        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                let num = convert[i][j];
                if(num === null)
                {
                    freeSpaces.push([i,j]);
                }
            } 
        }

        let discouraged = [] // this will be a list of  a list of coords. Each stop function will add their list of coordinates that should not be used.
        
        
        this.discourageSpawns(convert, freeSpaces, discouraged, genNumber);
        
        let [row, col] = [0,0];
        if(freeSpaces.length > 0)
        {
            const random = Math.floor(Math.random() * freeSpaces.length);
            [row,col] = freeSpaces[random];
            
        }
        else if(discouraged.length > 0)
        {
            console.log("no good choices");
            coordList = discouraged[discouraged.length-1];
            const random = Math.floor(Math.random() * coordList.length);
            [row,col] = coordList[random];
        }
        
        

        console.log("discouraged: " + discouraged + "    freeSpaces: " + freeSpaces);
        console.log("new tile (in other orientation): " + [row,col] + " with orientation: " + orientation);
        convert.splice(row, 1, convert[row].toSpliced(col, 1, genNumber) );
        this.layout = Game.convertBack(orientation, convert);
        let newTile = {};
        let coords = Game.convertCoords(orientation, [row,col], this._size);
        console.log("new tile: " + coords);
        newTile[coords] = true;

        let gameOver = !(this.canMove("left",this.layout) || this.canMove("right",this.layout) ||this.canMove("up",this.layout) ||this.canMove("down",this.layout));
        return [newTile, gameOver];
    }

    discourageSpawns(convert, freeSpaces, discouraged, genNumber)
    {
        //these functions have to run in a specific order, to give a priority of which discouraged spaces should be filled in first if there are no "free" spaces.
        // functions running later have a lower priority, so a spawn that makes it so that you can't move left will be allowed before a spawn that makes it so that you have to move down.
        this.stopBlocks(convert,freeSpaces,discouraged, genNumber);
        this.stopRowLeft(convert,freeSpaces,discouraged,genNumber);
    }

    static calcOrientation(layout)
    {
        let size = layout.length;
        let biggestNum = 0; // tracks the biggest number
        let biggestCoords = []; //tracks where the biggest number is
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if(layout[i][j] > biggestNum)
                {
                    biggestCoords = [i,j];
                    biggestNum = layout[i][j];
                }
            }
            
        }
        
        let orientation = ""; // now the cheating on the generation begins.
        /*
        The best way to play 2048 is to set the numbers up in a snaking pattern, with the biggest number in a corner, and then go from there to other side.
        then wrap back around the other way.
        so orientation will identify which way the user is snaking, to give the best generation for that. The system is to give the corner, and then where they're going from there.
        e.g. putting the biggest number in the top right corner and then having the next biggest to the left is NEW, because it is in the North-East corner, going West. 
        Top right snaking down would be NES, and so on. 
        
        When describing where to put things, I will describe it as if I'm snaking in a NEW direction, 
        so something like putting squares "under" the biggest number means perpendicular to the direction that the first row/column is filled.
        */
        //so this will get the corner that they're favouring
        if(biggestCoords[0] < size /2)
            orientation += "N";
        else
            orientation += "S";

        if(biggestCoords[1] < size /2)
            orientation += "W";
        else
            orientation += "E";

        switch(orientation)
        { // The >='s mean that the first option will be chosen if the directions they're trailing in are equal. e.g. if the top right corner is 128, and has 32 on both sides, NEW will be chosen over NES
            case "NE": orientation += layout[0][size-2] >= layout[1][size-1] ? "W" : "S"; break;
            case "SE": orientation += layout[size-1][size-2] >= layout[size-2][size-1] ? "W" : "N"; break;
            case "SW": orientation += layout[size-2][0] >= layout[size-1][1] ? "N" : "E"; break;
            case "NW": orientation += layout[1][0] >= layout[0][1] ? "S" : "E"; break;
        }
        //similar deal here, where if the difference isn't significant the two possible snake locations, then what I identify it as doesn't matter.
        //There is a possible issue of the biggest number being in some quadrant, but not actually in the corner, and small number being stuck in there.
        //The goal is to stop that from happening too much, and also skewing generation to allow the player to get out of that (like building a tower under the bigger number so you can move down and push the small number out the way.) 
        return orientation;
    }

    getLayoutSquare(i, j, layout)
    {
        if(this.isAlongCol)
            return layout[this.startIndex + (j*this.multiplier)][i];
        else
            return layout[i][this.startIndex + (j*this.multiplier)];
    }

    calcCoords(i, j)
    {
        if(this.isAlongCol)
            return [this.startIndex + (j*this.multiplier), i];
        else return [i, this.startIndex + (j*this.multiplier)];
    }

    static convertLayout(orientation, layout)
    {
        let convert = copy2DArray(layout);
        switch(orientation)
        {
            case "NEW": break;

            case "NES": //this is a transposition and then a reversal of both arrays.
                convert = transpose(convert);
                convert = convert.reverse();
                convert = convert.map(row => row.reverse());
            break;
            case "SEN": //this is a transposition and a reversal of the order of rows
                convert = transpose(convert);
                convert = convert.reverse();
            break;
            case "SEW": // this is just a reversal of the order of rows.
                convert = convert.reverse();
            break;
            case "SWE": // this is a reversal of both arrays
                convert = convert.reverse();
                convert = convert.map(row => row.reverse());
            break;
            case "SWN": // this is a transposition
                convert = transpose(convert);
            break;
            case "NWS": // this is a transposition and a reversal of the rows.
                convert = transpose(convert);
                convert = convert.map(row => row.reverse());
            break;
            case "NWE": // this is just a reversal of rows
                convert = convert.map(row => row.reverse());
            break;
            
        }
        return convert;
        

        
        
    }
    /**
     * 
     * @param {*} orientation, the orientation it should return to
     * @param {*} grid the layout that should be converted back from NEW orientation
     * @returns a new unrelated copy of that 2D array, converted back
     */
    static convertBack(orientation, grid)
    {
        let revert = copy2DArray(grid);
        switch(orientation)
        {
            case "NEW": break;

            case "NES": //this is a transposition and then a reversal of both arrays.
                revert = revert.map(row => row.reverse());       
                revert = revert.reverse();
                revert = transpose(revert);
                break;
            case "SEN": //this is a transposition and a reversal of the order of rows
                revert = revert.reverse();    
                revert = transpose(revert);
                break;
            case "SEW": // this is just a reversal of the order of rows.
                revert = revert.reverse();
                break;
            case "SWE": // this is a reversal of both arrays
                revert = revert.map(row => row.reverse());    
                revert = revert.reverse();
                break;
            case "SWN": // this is a transposition
                revert = transpose(revert);
                break;
            case "NWS": // this is a reversal of the rows and a transposition. 
                revert = revert.map(row => row.reverse());    
                revert = transpose(revert);
                break;
            case "NWE": // this is just a reversal of rows
                revert = revert.map(row => row.reverse());
                break;
            
        }
        return revert;
    }
    /**
     * This converts coordinates generated for the NEW orientation into the original orientation of the grid that the player is playing with.
     * @param {*} orientation the original orientation of the board
     * @param {*} coords The coords generated for a new tile, back when the layout was converted into NEW orientation
     * @param {*} size the length of the grid
     * @returns 
     */
    static convertCoords(orientation, coords, size)
    {
        let convert = [...coords];
        switch(orientation)
        {
            case "NEW": break;

            case "NES": //this is a transposition and then a reversal of both arrays.
                convert[0] = coords[1];
                convert[1] = coords[0];
                convert[0] = (size -1) - convert[0];
                convert[1] = (size -1) - convert[1];
                break;
            case "SEN": //this is a transposition and a reversal of the order of rows
                convert[0] = coords[1];
                convert[1] = coords[0];
                convert[0] = (size -1) - convert[0];
                break;
            case "SEW": // this is just a reversal of the order of rows.
                convert[0] = (size -1) - convert[0];
                break;
            case "SWE": // this is a reversal of both arrays
                convert[0] = (size -1) - convert[0];
                convert[1] = (size -1) - convert[1];
                break;
            case "SWN": // this is a transposition
                convert[0] = coords[1];
                convert[1] = coords[0];
                break;
            case "NWS": // this is a reversal of the rows and a transposition.
                convert[1] = (size -1) - convert[1];    
                convert[0] = convert[1]; // breaking from the norm here, because we've already made a change at this point
                convert[1] = coords[0];
                break;
            case "NWE": // this is just a reversal of rows
                convert[1] = (size -1) - convert[1];
                break;
        }
        return convert
    }

    /**
     * 
     * @param {*} direction the direction it is moving in
     * @param {*} layout the layout that I am testing this with
     * @returns true if a move in this direction is possible, false otherwise
     */
    canMove(direction, layout)
    {

        this.startIndex = this._size -1; // this gives the starting point to start looking at
        this.isAlongCol = true;
        switch(direction)
        {
            case "left": this.startIndex = 0; this.isAlongCol = false; break;
            case "right": this.isAlongCol = false; break;
            case "up": this.startIndex=0; break;
            case "down":  break;
            default: break;
        }
        this.multiplier = this.startIndex ===0 ? 1 : -1;


        for (let i = 0; i < this._size; i++) 
        {
            let line = [];
            let foundGap = false;
            for (let j = 0; j < this._size; j++) 
            {
                let val = this.getLayoutSquare(i,j, layout);
                if(val !== null)
                {
                    if(foundGap) //so if there's an empty space, and then an actual value, then that value can move in the direction.
                        return true;
                    line.push(val);
                    if(line.length > 1 && line[line.length -1] === line[line.length -2])// if a merge can happen in that direction, return true;
                        return true
                } 
                else
                    foundGap = true;
            }
            
        }
        return false;
        
    }

    stopBlocks(convert, freeSpaces, discouraged, genNumber)
    {
        //this will stop a big block of a row or 2 being filled
        //a space will be considered as one if the value is null or it can merge right or down. It doesn't look in all directions, because then it would get double counted by the square that can merge with it
        //I need to find if you can find a row or more that only has one space in it (and this space has to be an actual gap with no square in it), and no squares beneath it. in this case, I can't allow a square to be put in that spot
        let numSpaces = 0;
        let holes = [];
        for (let i = 0; i < this._size; i++) //this goes through the rows, first until it finds any space, then if there's only one space by that row, checking if the player can move down by looking at the rows beneath it.
        {
            if(numSpaces === 0)
            {
                for (let j = 0; j < this._size; j++) 
                {
                    let rightSquare = j < this._size -1 ? convert[i][j+1] : -1; // TODO: have code in to see how many rows down we are, and therefore whether to snake left or right, and use that to determine genNumber based on the value of squares around this.
                    let downSquare = i < this._size -1 ? convert[i+1][j] : -1;
                    if(convert[i][j] === null) // there's an issue here of disallowing the spawn of squares if they would be able to merge to the left or up from where they spawn, so this takes care of that edge case
                    {
                        numSpaces++;
                        let upSquare = i > 0 ? convert[i-1][j] : -1;
                        let leftSquare = j > 0 ? convert[i][j-1] : -1;
                        if(rightSquare !== genNumber && downSquare !== genNumber && leftSquare !== genNumber && upSquare !== genNumber)
                            holes.push([i,j]); // only count it as a hole if it can't merge in any direction.
                    }
                    else if(convert[i][j] === rightSquare) 
                        numSpaces++;
                    else if(convert[i][j] === downSquare)
                        numSpaces++;
                }
            }
            else if(numSpaces === 1 && holes.length === 1) // this is the only case where I have to block a spawn in these conditions
            {
                let row = i;
                let canMoveAside = false;
                while( row < this._size && !canMoveAside) // this while loop goes through the grid below the row that can form a block and looks to see if there's a possible move left or right
                {
                    
                    let col = 0;
                    let prevNum = null;
                    let isASpace = false;
                    let isATile = false
                    while(col < this._size && !canMoveAside)
                    {
                        
                        let num = convert[row][col];
                        if (num === null)
                            isASpace = true;
                        else
                            isATile = true;
                        if(num === prevNum && prevNum !== null) // If there's a merge possible by 2 non-empty squares being next to each other, then
                            canMoveAside = true;
                        if(isASpace && num !== null) // if there's an empty square somewhere in the row, then you find another non-empty square, it can move left.
                            canMoveAside = true;
                            
                        prevNum = num;
                        col++;
                    }
                    if(isASpace && isATile)// this catches being able to move right when the only empty space is to the right
                        canMoveAside = true;
                    row++;
                }
                if(!canMoveAside)
                {
                    let hole = holes[0];
                    discouraged.push([hole]);
                    console.log("hole: " + hole);
                    let index = 0;
                    let isFound = false;
                    while (index < freeSpaces.length && !isFound)
                    {
                        isFound = hole.toString() === freeSpaces[index].toString(); // the wonders of comparing arrays.
                        index++;
                    }
                    if(isFound)
                        index--;
                    freeSpaces.splice(index, 1); // so get rid of that as a viable spawning point
                    //This seems to work now, I can't really print debug it though, since all the variables give their end value here.
                }
                break;
            }
            else
                break;
        }
    }

    /**
     *  The next thing to stop is the player being forced to move the top row away left. This can also be extended to when snaking, stopping that row from having to go right, and so on.
        if the row is full of squares, or a merge can happen in that top row (up or right), then this is a non-issue, so remove those options first.
        Otherwise, generate a number that eiter fills in the top row, or it allows for some move up or right, either moving across a gap or merging.
        If the actual top row is full and no merge right can be made, then this algorithm should look at the next row, and do the same procedure with the direction flipped . If that condition isn't met, then stop
     * @param {*} convert the converted layout to do this algorithm on
     * @param {*} freeSpaces the coordinates of spaces that are currently considered viable spawning locations
     * @param {*} discouraged 
     * @param {*} genNumber 
     */
    stopRowLeft(convert, freeSpaces, discouraged, genNumber)
    {
        
        for (let i = 0; i < this._size; i++) 
        {
            let direction = i % 2 === 0? 1 : -1;
            let rowComplete = true; // This says whether the row is full of squares that can't move, so if it's false, then it's possible for the row to move left or right.
            for (let j = 0; j < this._size; j++) 
            {
                
                if(convert[i][j] === null || ( j < this._size -1 && convert[i][j] === convert[i][j+1]))
                    rowComplete = false;
                
            }

            if(!rowComplete) // so once the correct row has been found, figure out what needs doing.
            {

                let horizontal = direction ===1 ? "right" : "left";
                if(!this.canMove("up", convert) && !this.canMove(horizontal, convert)) // in this case, something has to be added so that an up move, or the correct horizontal move can be made.
                {
                    // now eliminate spaces from freeSpaces that wouldn't allow a move up or to the correct side.
                    let discouragedCoords = [];

                    for (let j = 0; j < freeSpaces.length; j++) {
                        const coords = freeSpaces[j];
                        const above = coords[0] - 1 >= 0 ? convert[coords[0]-1][coords[1]] : null; // set it to null if you can't move in that direction
                        const endPoint = direction === 1? 0 : this._size-1;
                        const aside = coords[1] !== endPoint ? convert[coords[0]][coords[1] + direction] : null;
                        const atEnd = coords[0] === i && coords[1] === endPoint;
                        if(above !== null && aside !== null && genNumber !== above && genNumber !== aside && !atEnd)
                        {
                            discouragedCoords.push(coords);
                            let index = 0;
                            let isFound = false;
                            while (index < freeSpaces.length && !isFound)
                            {
                                isFound = coords.toString() === freeSpaces[index].toString(); // the wonders of comparing arrays.
                                index++;
                            }
                            if(isFound)
                            {
                                index--;
                                freeSpaces.splice(index, 1); // so get rid of that as a viable spawning point
                            }
                                
                        }
                    }
                    discouraged.push(discouragedCoords);
                }

                break;
            }
                
        }
    }
}

