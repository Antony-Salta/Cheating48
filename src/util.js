export function copy2DArray(array)
{
    let temp = [];
    for (let i = 0; i < array.length; i++) {
        temp.push([...array[i]]);
    }
    return temp;
}