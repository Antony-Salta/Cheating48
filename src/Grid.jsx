import { useState } from "react";
import Square from "./Square"

/**
 * 
 * @param {*} layout: layout will be a 2D, 4x4 array representing the grid, storing the numbers of each square. 
 */
const colourMap = {
    0: ["#888888", "#888888"],
    2: ["#eee4da", "#000000"],
    4: ["#ede0c8", "#000000"],
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

export default function Grid()
{
    const rowNum = Math.floor(Math.random() * 4);
    const colNum = Math.floor(Math.random() * 4);
    let initialLayout = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    initialLayout.splice(rowNum, 1, initialLayout[rowNum].toSpliced(colNum, 2, 1024, 8) );

    const [layout, setLayout] = useState(initialLayout);

    let index = -1;
    return (
        <div className="grid-container">
        {
            layout.map(row => row.map(square => 
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
}