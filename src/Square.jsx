import { Textfit } from "react-textfit";
export default function Square({bgCol, fontCol, value})
{
    let fontSize = "em";
    if(value !== null)
    {
        let size = 10 / ("" + value).length;
        fontSize = Math.floor(size) + fontSize;
    }
    else
        fontSize = "0em";
    
    return (
        <div className="square grid-item" style={{backgroundColor : bgCol, color: fontCol}}>
            <Textfit mode ="single" forceSingleModeWidth={false} min={0.3}>{value}</Textfit>
        </div>
    )
}