import { Textfit } from "react-textfit";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
export default function Square({bgCol, fontCol, value, shouldPop, xMove =0, yMove =0,})
{
    const [scale, setScale] = useState(1);
    const domRef = useRef(null);
    const [dimensions, setDimensions] = useState({height : 0, width: 0});
    useEffect(() =>
    {
      if (shouldPop) {
        setScale(1.1);
        setTimeout(
            () => {setScale(1);}, 
            150 /* 100ms == 0.1s */
        );
      }
    }, [shouldPop]);

    useLayoutEffect( () => {
      let rect = domRef.current.getBoundingClientRect();
      let margin = window.getComputedStyle(domRef.current).marginTop;
      margin = margin.split("px")[0];
      margin = Number(margin);
      setDimensions({height: rect.height +2*margin, width: rect.width + 2*margin})
    }, []);
      
    const move = `translate(${xMove * dimensions.width}px, ${yMove * dimensions.height}px)`;
    let fontSize = '0';
    if(value !== null)
    {
      let length = value.toString().length;
      if(length === 1) // this is just an edge case since single digit ones just seem to take up more space
        fontSize = dimensions.width + "px";
      else
        fontSize = (dimensions.width * 1.5/length) + "px";
    }
    const style = {transform: move, backgroundColor : bgCol, color: fontCol, fontSize : fontSize};
    
    if(xMove === 0 && yMove === 0)
      style.transition = "transform 0s";
      
      

    //making the key the value means that textFit re-renders, and is assured to be the correct size whenever the value changes.
    return (
      <div ref={domRef} className="quick-pop grid-item" style={{transform: `scale(${scale})`}}>
        {value !== null && 
        <div  className="square" style={style}>
            {value}
        </div>}
      </div>
    )
}
//<Textfit  key ={value} mode ="single" forceSingleModeWidth={false} min={0.3}>{value}</Textfit>