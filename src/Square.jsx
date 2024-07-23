import { Textfit } from "react-textfit";
import { useState, useRef, useEffect } from "react";
export default function Square({bgCol, fontCol, value, justSpawned})
{
    const [scale, setScale] = useState(1);
    const [prevValue, setPrevValue] = useState(null);
    const [isNew, setIsNew] = useState(justSpawned);
    
    if(justSpawned  && !isNew)
      setIsNew(true);
    let shouldPop = (value !== null && prevValue !== value) || isNew == true;
  
    

    useEffect(() => {
      if (shouldPop) {
        setScale(1.1);
        setPrevValue(value);
        setIsNew(false);
        shouldPop = false;
        setTimeout(
            () => {setScale(1);}, 
            600 /* 100ms == 0.1s */
        );
      }
      else{
        setPrevValue(value);
      }
    }, [shouldPop]);

  
    const style = {transform: `scale(${scale})`, backgroundColor : bgCol, color: fontCol};
    //making the key the prevValue means that textFit re-renders, and is assured to be the correct size whenever the value changes.
    return (
        <div className="square grid-item" style={style}>
            <Textfit key={prevValue} mode ="single" forceSingleModeWidth={false} min={0.3}>{value}</Textfit>
        </div>
    )
}