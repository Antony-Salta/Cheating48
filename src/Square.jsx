import { Textfit } from "react-textfit";
import { useState, useRef, useEffect } from "react";
export default function Square({bgCol, fontCol, value, shouldPop})
{
    const [scale, setScale] = useState(1);
    useEffect(() =>
    {
      if (shouldPop) {
        setScale(1.1);
        setTimeout(
            () => {setScale(1);}, 
            600 /* 100ms == 0.1s */
        );
      }
    }, [shouldPop]);
      

  
    const style = {transform: `scale(${scale})`, backgroundColor : bgCol, color: fontCol};
    //making the key the value means that textFit re-renders, and is assured to be the correct size whenever the value changes.
    return (
        <div className="square grid-item" style={style}>
            <Textfit key ={value} mode ="single" forceSingleModeWidth={false} min={0.3}>{value}</Textfit>
        </div>
    )
}