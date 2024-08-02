import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Game } from './gameLogic';
import { copy2DArray} from './util';
import {useCookies} from 'react-cookie';
import Score from './Score';
import Grid from './Grid';

let initialLayout = [];
const size = 4;
for(let i=0; i< size; i++)
{
    initialLayout.push(new Array(size).fill(null));
}

const moveTime = 120; //time for a move animation in milliseconds, needs to be synced up with what the transition time is in the css file.
let game = new Game(initialLayout);
game.generateNewNum();
initialLayout = game.layout;


function App() 
{
    const [cookies, setCookie, removeCookie] = useCookies(['layout']); 
    // const [layout, setLayout] = useCookies("layout", new LayoutWrapper(initialLayout)); // need to figure out how to set default values for this cookie.
    // const [prevLayout, setPrevLayout] = useCookies("prevLayout", null);
    // const [score, setScore] = useCookies("score", 0);
    // const [record, setRecord] = useCookies("record", 0);

    const [increase, setIncrease] = useState(0);
    const [prevLayout, setPrevLayout] = useState(null);

    const layout = cookies.layout ?? new LayoutWrapper(initialLayout); // the wonders of not being able to set a normal default value for cookies

    useEffect(() =>{
        game = new Game(layout.grid);
    }, []);
    
    //const [layout, setLayout] = useState(new LayoutWrapper(copy));
    //const [prevLayout, setPrevLayout] = useState(null);
    const [gameUpdates, setGameUpdates] = useState({toPop: {}, newTile: {}, moveCoords : {}});
    const [timeoutID, setTimeoutID] = useState(null);
    const [ID, setID] = useState(-1); //this is used to force a re-render every time things change, so that there aren't weird animation glitches. Not great, but oh well.

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
        let [tempLayout,  gameUpdates, tempIncrease] = game.handleMove(direction);
        
        if(gameUpdates.newTile !== false) //so if the board has actually changed.
        {
            let copy = copy2DArray(layout.grid);
            setPrevLayout(new LayoutWrapper(copy));
            copy = copy2DArray(tempLayout);
            setCookie('layout',new LayoutWrapper(copy)); 
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

            setIncrease(tempIncrease);
            setCookie('score', (cookies.score ?? 0) + tempIncrease);

        }
            
    }
    function reset()
    {
        removeCookie('layout');
        removeCookie('score');
        removeCookie('record');
    }
    function undo()
    {
        if(timeoutID !== null)
            clearTimeout(timeoutID);
        
        setTimeoutID(null);
        let states = game.undo();
        if(states)
        {
            setID(i => (i + (size*size)) % (size*size*2));
            let newState =states[0];
            let prevLayout = states[1]; 
            let decrease = newState[1];
            let copy = copy2DArray(newState[0]);
            setCookie('layout', new LayoutWrapper(copy));
            setCookie('score', (cookies.score ?? 0) - decrease);
            if(prevLayout)
                setPrevLayout(new LayoutWrapper(copy2DArray(prevLayout)))
            else
                setPrevLayout(null);
        } 

    }


    return (
        
        <div onKeyDown={(e) => handleKeyDown(e)}  tabIndex="0" autoFocus={true}>
            <div>
                <button onClick={() => reset()}> Reset</button>
                <button onClick={() => undo()} className={prevLayout === null ? "disabled" : ""} >Undo</button>
            </div>
            <div>
                <Score score={cookies.score ?? 0} increase={increase}/>
                <Grid layout={layout} prevLayout={prevLayout} gameUpdates={gameUpdates} ID={ID} timeoutID={timeoutID} size={size}/>
            </div>
        </div>
    )


}

export default App;

class LayoutWrapper{
  constructor(grid)
  {
      this.grid = grid;
  }
}
