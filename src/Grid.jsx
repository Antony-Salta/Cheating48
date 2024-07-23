import { useEffect, useRef, useState } from "react";
import Square from "./Square"
import {Game} from "./gameLogic.js"

/**
 * 
 * @param {*} layout: layout will be a 2D, 4x4 array representing the grid, storing the numbers of each square. 
 */
const colourMap = {
    null: ["#888888", "#888888"],
    2: ["#eee4da", "#333333"],
    4: ["#ede0c8", "#333333"],
    8: ["#f2b179", "#ffffff"],
    16: ["#f59563", "#ffffff"],
    32: ["#f67c60", "#ffffff"],
    64: ["#f65e3b", "#ffffff"],
    128: ["#edcf73", "#ffffff"],
    256: ["#edcc62", "#ffffff"],
    512: ["#edc850", "#ffffff"],
    1024: ["#edc53f", "#ffffff"],
    2048: ["#edc22d", "#ffffff"],
    "higher": ["#000000", "#ffffff"],
}

let initialLayout = [];
const size = 4;
for(let i=0; i< size; i++)
{
    initialLayout.push(new Array(size).fill(null));
}

const game = new Game(initialLayout);
const initialNewTile = game.generateNewNum();


export default function Grid()
{
    

    const [layoutClass, setLayout] = useState(new LayoutWrapper(game.layout));
    const [toPop, setToPop] = useState({});
    const keyOffset = useRef(0); // this is just here to force re-renders on the squares, since it's possible for a square to get the same props twice or more, but need to pop twice or more, so it can't be distuinguished within the component.
    let index = -1;
    let rowNum =-1;
    return (
        <div className="grid-container" onKeyDown={(e) => handleKeyDown(e)} tabIndex="0" autoFocus={true}>
        {
            layoutClass.layout.map((row) => 
            {
                rowNum++;
                let colNum =-1;
                return row.map((square) => 
                {
                    colNum++;
                    let value = square;
                    index++;
                    
                    if (value > 2048)
                        value = "higher";

                    let shouldPop = toPop[[rowNum,colNum]];
                    let tempIndex = index;
                    if(shouldPop)
                    {
                        tempIndex = 9999 + keyOffset.current; // some key messing to force a re-render if the same coords keeps on getting the new tile added to it. 
                        keyOffset.current = (keyOffset.current+1) % (size * size * 2); 
                    }
                        
                    return (
                            <Square 
                            key={tempIndex} 
                            bgCol={colourMap[value][0]} 
                            fontCol={colourMap[value][1]} 
                            value={square} 
                            shouldPop={shouldPop}
                            />
                    );
                });  
            })
        }
        </div>
    ); 

    function handleKeyDown(e)
    {
        let direction = "";
        switch(e.key)
        {
            case "ArrowLeft":
            case "a": direction = "left"; break;
            case "ArrowRight":
            case "d": direction = "right"; break;
            case "ArrowUp":
            case "w": direction = "up"; break;
            case "ArrowDown":
            case "s": direction = "down"; break;
            default: return null;
        }
        let [temp, toPop] = game.handleMove(direction);
        // let newVersion = [];
        // for (let i = 0; i < temp.length; i++) {
        //     newVersion.push([...temp[i]]);
        // }
        if(Object.keys(toPop).length !== 0) //so if the board has actually changed.
        {
            setLayout(new LayoutWrapper(temp));
            setToPop(toPop);
        }
            
        

    }
}

class LayoutWrapper{
    constructor(layout)
    {
        this.layout = layout;
    }
}