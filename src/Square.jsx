import useFitText from "use-fit-text"
export default function Square({bgCol, fontCol, value})
{
    const {fontSize, ref} = useFitText({minFontSize: 5});
    return (
        <div ref={ref} className="square grid-item" style={{fontSize : fontSize, backgroundColor : bgCol, color: fontCol}}>
            {value}
        </div>
    )
}