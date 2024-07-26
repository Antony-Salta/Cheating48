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

const moveTime = 300; //time for a move animation in milliseconds, needs to be synced up with what the transition time is in the css file.

const game = new Game(initialLayout);
game.generateNewNum();


export default function Grid()
{
    let copy = copy2DArray(game.layout);

    const [layout, setLayout] = useState(new LayoutWrapper(copy));
    const [prevLayout, setPrevLayout] = useState(null);
    const [gameUpdates, setGameUpdates] = useState({toPop: {}, newTile: {}, moveCoords : {}});
    const keyOffset = useRef(0); // this is just here to force re-renders on the squares, since it's possible for a square to get the same props twice or more, but need to pop twice or more, so it can't be distuinguished within the component.
    const [timeoutID, setTimeoutID] = useState(null);
    const [ID, setID] = useState(-1); //this is used to force a re-render every time things change, so that there aren't weird animation glitches. Not great, but oh well.
    let index = -1;
    let rowNum =-1;
    
    const isMoving = timeoutID !== null;
    const layoutToUse = isMoving ?  prevLayout : layout; 
    if(isMoving)
        console.log(gameUpdates.moveCoords);
    // if (!isMoving)
    //     console.log(gameUpdates.toPop);
    //now I need to have a conditional thing with a timer that renders the moving animation, then the new board after, that can be interrupted if another move is made.
    return (
        <div className="grid-container" onKeyDown={(e) => handleKeyDown(e)} tabIndex="0" autoFocus={true}>
        {
            layoutToUse.grid.map(row => 
            {
                rowNum++;
                let colNum =-1;
                return row.map(square => 
                {
                    colNum++;
                    let value = square;
                    index++;
                    
                    if (value > 2048)
                        value = "higher";
                    
                    let shouldPop = (gameUpdates.toPop[[rowNum,colNum]] || gameUpdates.newTile[[rowNum,colNum]]) && !isMoving;
                    let key = index + ID;
                    // if(shouldPop)
                    // {
                    //     key = 9999 + keyOffset.current; // some key messing to force a re-render if the same coords keeps on getting the new tile added to it. 
                    //     keyOffset.current = (keyOffset.current+1) % (size * size * 100); 
                    // }
                    let x=0;
                    let y = 0;
                    let direction = gameUpdates.moveCoords.direction;
                    let move = gameUpdates.moveCoords[[rowNum,colNum]];
                    if((move ?? false) && isMoving) // so if it's actually defined
                    {
                        if(gameUpdates.moveCoords.isAlongCol)
                            y = move * direction;
                        else
                            x = move * direction;
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
        let [temp,  gameUpdates] = game.handleMove(direction);
        
        if(gameUpdates.newTile !== false) //so if the board has actually changed.
        {
            console.log("board has changed");
            let copy = copy2DArray(layout.grid);
            setPrevLayout(new LayoutWrapper(copy));
            copy = copy2DArray(temp);
            setLayout(new LayoutWrapper(copy)); 
            setID(i => (i + (size*size)) % (size*size*2));
            setGameUpdates(gameUpdates);
            
            // what this should do is clear the timeout if a valid key is pressed before the move animation is finished, and essentially just move on faster.
            if(timeoutID !== null)
            {
                clearTimeout(timeoutID); //somewhat issue here where if someone moves quickly, they get pieces moving diagonally. This seems  to be because the same number is in the same space, but is moving to different spaces in different animations, because it isn't really the same square but I don't save that.
                // A main issue is if you do 3+ moves quickly, then you can get the middle moves not being rendered during the time that they should be moving, for some reason.
                //I think the return thing happens because the square has moved slightly up, then it's being told to move so far to the right, but it also moves down at the same time, so I need to make it finish the first animation immediately
            }
            setTimeoutID(setTimeout( () => {
                setTimeoutID(null); // this will trigger a re-render where everything should have finished moving, and then showing the new state of the board.
            }, moveTime));

        }
            
        

    }
}



class LayoutWrapper{
    constructor(grid)
    {
        this.grid = grid;
    }
}