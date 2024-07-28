import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Game } from './gameLogic'
import { copy2DArray} from './util'
import Score from './Score'
import Grid from './Grid'

let initialLayout = [];
const size = 4;
for(let i=0; i< size; i++)
{
    initialLayout.push(new Array(size).fill(null));
}

const moveTime = 120; //time for a move animation in milliseconds, needs to be synced up with what the transition time is in the css file.

const game = new Game(initialLayout);
game.generateNewNum();



function App() {
  let copy = copy2DArray(game.layout);
  const [score, setScore] = useState(0);
  const [increase, setIncrease] = useState(0);

  const [layout, setLayout] = useState(new LayoutWrapper(copy));
  const [prevLayout, setPrevLayout] = useState(null);
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

          setIncrease(tempIncrease);
          setScore(score => score + tempIncrease);

      }
          
      

  }

  return (
    <div onKeyDown={(e) => handleKeyDown(e)}  className={"whole"} tabIndex="0" autoFocus={true}>
      <Score score={score} increase={increase}/>
      <Grid layout={layout} prevLayout={prevLayout} gameUpdates={gameUpdates} ID={ID} timeoutID={timeoutID} size={size}/>
      
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
