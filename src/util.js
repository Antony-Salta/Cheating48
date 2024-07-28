export function copy2DArray(array)
{
    let temp = [];
    for (let i = 0; i < array.length; i++) {
        temp.push([...array[i]]);
    }
    return temp;
}
export function transpose(array)
{
    let copy = copy2DArray(array);
    return copy.map((row, rowNum, array2D) => row.map((val, colNum) => array2D[colNum][rowNum]));
}