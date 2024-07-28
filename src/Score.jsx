import { useState } from "react";

export default function Score({score, increase})
{
    const [shouldFade, setShouldFade] = useState(true);
    const [offset, setOffset] = useState(0);
    let className = "increase" + (increase === 0 ? " hideIncrease": "");
    return (
    <>
    <div key={score} className={className}>
        +{increase}
    </div>
    <div className="score">
        Score: 
        <div className="innerScore">{score}</div>
    
    </div>
    </>
    );
}