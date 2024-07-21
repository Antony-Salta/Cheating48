export class Game{
    constructor(layout)
    {
        this._layout = layout;
        this._size = layout.length;
    }

    handleMove(direction)
    {
        let startIndex = this._size -1; // this gives the starting point to start looking at
        let isAlongRow = true;
        switch(direction)
        {
            case "left": startIndex = 0; isAlongRow = false; break;
            case "right": isAlongRow= false;break;
            case "up": startIndex=0; break;
            case "down":  break;
            default: break;
        }
        let multiplier = startIndex ===0 ? 1 : -1;
        
        for(let i = 0; i < this._size; i++)
        {
            
        }
        
        


        


        return this._layout;
    }

    /**
     * This is going to start simple for now, but there's going to have to be a lot more detection here later
     */
    generateNewNum()
    {
        const rowNum = Math.floor(Math.random() * 4);
        const colNum = Math.floor(Math.random() * 4);
        this._layout.splice(rowNum, 1, this._layout[rowNum].toSpliced(colNum, 1, 2) );
    }

    get layout()
    {
        return this._layout
    }
}