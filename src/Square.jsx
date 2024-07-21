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
        <div className="square grid-item" style={{fontSize : fontSize, backgroundColor : bgCol, color: fontCol}}>
            {value}
        </div>
    )
}