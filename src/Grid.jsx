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
    const [newTile, setNewTile] = useState(initialNewTile);
    const prevNewTile = useRef([-1,-1, 0]);
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
                    let isNew = rowNum === newTile[0] && colNum === newTile[1];
                    let tempIndex = index;
                    if(isNew && prevNewTile.current[0] === newTile[0] && prevNewTile.current[1] === newTile[1])
                    {
                        tempIndex = 9999 + prevNewTile.current[2] // some key messing to force a re-render if the same coords keeps on getting the new tile added to it. 
                        prevNewTile.current[2] = (prevNewTile.current[2]+1) %3; 
                    }
                        
                    return ( <Square 
                        key={tempIndex} 
                        bgCol={colourMap[value][0]} 
                        fontCol={colourMap[value][1]} 
                        value={square} 
                        isNew={isNew}
                        />);
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
        let [temp, coords] = game.handleMove(direction);
        // let newVersion = [];
        // for (let i = 0; i < temp.length; i++) {
        //     newVersion.push([...temp[i]]);
        // }
        if(coords[0] !== -1) //so if the board has changed.
        {
            setLayout(new LayoutWrapper(temp));
            prevNewTile.current = [...newTile, prevNewTile.current[2]];
            setNewTile(coords);
        }
            
        

    }
}

class LayoutWrapper{
    constructor(layout)
    {
        this.layout = layout;
    }
}