import { Textfit } from "react-textfit";
import { useState, useRef, useEffect } from "react";
export default function Square({bgCol, fontCol, value})
{
    const [scale, setScale] = useState(1);
    const [prevValue, setPrevValue] = useState(null);
    const shouldPop = value !== null && prevValue !== value;
  
    useEffect(() => {
      if (shouldPop) {
        setScale(1.1);
        setPrevValue(value);
        setTimeout(
            () => setScale(1), 
            100 /* 100ms == 0.1s */
        );
      }
    }, [shouldPop, setScale]);
  
    const style = {transform: `scale(${scale})`, backgroundColor : bgCol, color: fontCol};
    //making the key the prevValue means that textFit re-renders, and is assured to be the correct size whenever the value changes.
    return (
        <div className="square grid-item" style={style}>
            <Textfit key={prevValue} mode ="single" forceSingleModeWidth={false} min={0.3}>{value}</Textfit>
        </div>
    )
}