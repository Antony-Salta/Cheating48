import { copy2DArray } from "./util";
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
                let val = this.getLayoutSquare(i,j);
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
                            if(this.getLayoutSquare(i,j) !== null)
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
                if(this.getLayoutSquare(i,j) !== null && movesNeeded[j] > 0)
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
        if(!isSame) // If it isn't the same, then a move hasn't actually happened
        {
            newTile = this.generateNewNum();
        }
        return [this.layout, {toPop: toPop, newTile: newTile, moveCoords: moveCoords}, increase];
    }
    _

    /**
     * This is going to start simple for now, but there's going to have to be a lot more detection here later
     */
    generateNewNum()
    {
        let freeSpaces = {};
        let numFree = 0;
        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                if(this.layout[i][j] === null)
                {
                    freeSpaces[numFree] = [i,j];
                    numFree++;
                }
                    
            } 
        }
        const random = Math.floor(Math.random() * numFree);
        const [row, col] = freeSpaces[random];
        this.layout.splice(row, 1, this.layout[row].toSpliced(col, 1, 2) );
        
        let mapping = {};
        mapping[[row, col]] = true;
        return mapping;
    }
    getLayoutSquare(i, j)
    {
        if(this.isAlongCol)
            return this.layout[this.startIndex + (j*this.multiplier)][i];
        else
            return this.layout[i][this.startIndex + (j*this.multiplier)];
    }
    calcCoords(i, j)
    {
        if(this.isAlongCol)
            return [this.startIndex + (j*this.multiplier), i];
        else return [i, this.startIndex + (j*this.multiplier)];
    }
}

