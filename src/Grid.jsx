import { useEffect, useRef, useState } from "react";
import Square from "./Square"
import {Game} from "./gameLogic.js"
import { copy2DArray } from "./util.js";

/**
 * 
 * @param {*} layout: layout will be a 2D, 4x4 array representing the grid, storing the numbers of each square. 
 */
const colourMap = {
    null: ["#888888", "#888888"],
    2: ["#ccc4ba", "#333333"],
    4: ["#cdc0a8", "#333333"],
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



export default function Grid({layout, prevLayout, gameUpdates, ID, timeoutID, size =4, gameOver = false})
{
    const isMoving = timeoutID !== null;
    const layoutToUse = isMoving ?  prevLayout : layout; 
    
    if (!isMoving)
        console.log(gameUpdates.newTile);

    let gridStyle = {};
    if(gameOver)
    {
        gridStyle = {opacity: 0.5};
    }
    //now I need to have a conditional thing with a timer that renders the moving animation, then the new board after, that can be interrupted if another move is made.
    return (
        <div className="grid-container" style={gridStyle}>
        {
            layoutToUse.grid.map((row, rowNum) => 
            {
                return row.map((square, colNum) => 
                {
                    let value = square;
                    let index = (rowNum * size) + colNum;
                    
                    if (value > 2048)
                        value = "higher";
                    
                    let shouldPop = (gameUpdates.toPop[[rowNum,colNum]] || gameUpdates.newTile[[rowNum,colNum]]) && !isMoving;
                    let key = index + ID;
                    
                    let x=0;
                    let y = 0;
                    let zPriority = 0; // this is a little thing to make squares on the opposite side of where the squares move to get a higher z-index, so that they appear in front instead of slipping behind.
                    let direction = gameUpdates.moveCoords.direction;
                    let move = gameUpdates.moveCoords[[rowNum,colNum]];
                    if((move ?? false) && isMoving) // so if it's actually defined
                    {
                        if(gameUpdates.moveCoords.isAlongCol)
                        {
                            y = move * direction;
                            zPriority = (size - rowNum) * direction;
                        }
                        else
                        {
                            x = move * direction;
                            zPriority = (size - colNum) * direction;
                        }
                    }
                    
                    return (
                            <Square 
                            key={key} 
                            bgCol={colourMap[value][0]} 
                            fontCol={colourMap[value][1]} 
                            value={square} 
                            shouldPop={shouldPop}
                            xMove={x}
                            yMove={y}
                            zPriority={zPriority}
                            />
                    );
                });  
            })
        }
        
        </div>
        
    ); 

    
}



