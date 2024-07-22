export class Game{
    constructor(layout)
    {
        this.layout = layout;
        this._size = layout.length;
    }

    handleMove(direction)
    {
        let prevLayout = []
        for (let i = 0; i < this._size; i++) {
            prevLayout.push([...this.layout[i]]);   
        }
        //console.log(this.layout); // for some reason this console log looks into the future and prints out the value of the layout at the end of this function.

        let startIndex = this._size -1; // this gives the starting point to start looking at
        let isAlongCol = true;
        switch(direction)
        {
            case "left": startIndex = 0; isAlongCol = false; break;
            case "right": isAlongCol = false; break;
            case "up": startIndex=0; break;
            case "down":  break;
            default: break;
        }
        let multiplier = startIndex ===0 ? 1 : -1;
        
        for(let i = 0; i < this._size; i++)
        {
            //first off, make a list of the numbers, not including 0, in the order they appear
            //with the first being closest to the edge it is pushed towards. 
            //So if the player goes right and there is a row of 2, 8, 0, 16, the list will be 16, 8, 2
            let line = [];
            if(isAlongCol)
            {
                for (let j = 0; j < this._size; j++) {
                    let val = this.layout[startIndex + (j*multiplier)][i];
                    if(val !== null)
                        line.push(val);
                }
            }
            else
            {
                for (let j = 0; j < this._size; j++) {
                    let val = this.layout[i][startIndex + (j*multiplier)];
                    if(val !== null)
                        line.push(val);
                }
            }


            //after the line has been made, look to make pairs, go through the list, look at one and the one right after it, and see if they're the same. 
            //If so, replace them in the list and look past both of them. If not, just look past the first one.
            let index = 0;
            while(index < line.length-1)
            {
                if(line[index] === line[index +1])
                {
                    line.splice(index, 2, line[index] * 2);
                }
                index++;
            } 
            
            //now, make this line into the layout
            if(isAlongCol)
            {
                for (let j = 0; j < this._size; j++) {
                    let newInsertion = j < line.length ? line[j] : null;
                    this.layout[startIndex + (j*multiplier)][i] = newInsertion;
                }
                
            }
            else
            {
                for (let j = 0; j < this._size; j++) {
                    let newInsertion = j < line.length ? line[j] : null;
                    this.layout[i][startIndex + (j*multiplier)] = newInsertion;
                }
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
        if(!isSame) // If it isn't the same, then a move hasn't actually happened
        {
            this.generateNewNum();
        }
        return [this.layout, isSame];
    }
    _

    /**
     * This is going to start simple for now, but there's going to have to be a lot more detection here later
     */
    generateNewNum()
    {
        let freeSpaces = { 5 : "bingo"};
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
        const [rowIndex, colIndex] = freeSpaces[random];
        this.layout.splice(rowIndex, 1, this.layout[rowIndex].toSpliced(colIndex, 1, 2) );
    }
}