import { useEffect, useState } from "react";
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
game.generateNewNum();


export default function Grid()
{
    

    const [layoutClass, setLayout] = useState(new LayoutWrapper(game.layout));
    const [ID, setID] = useState(0);
    let index = -1;
    return (
        <div className="grid-container" onKeyDown={(e) => handleKeyDown(e)} tabIndex="0" autoFocus={true}>
        {
            layoutClass.layout.map(row => row.map(square => 
            {
                let value = square;
                index++;
                if (value > 2048)
                    value = "higher";
                return ( <Square key={index} bgCol={colourMap[value][0]} fontCol={colourMap[value][1]} value={value} />);
            }  
            ))
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
        let [temp, isSame] = game.handleMove(direction);
        // let newVersion = [];
        // for (let i = 0; i < temp.length; i++) {
        //     newVersion.push([...temp[i]]);
        // }
        if(!isSame)
        {
            setLayout(new LayoutWrapper(temp));
            if(ID >= (size*size*2))
                setID(0);
            else
                setID(ID + (size*size));
        }
            
        

    }
}

class LayoutWrapper{
    constructor(layout)
    {
        this.layout = layout;
    }
}