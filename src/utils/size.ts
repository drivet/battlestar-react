export function getSize(sizeProp: string): [string, string] {
    let size;
    if (sizeProp === 'xs') {
        size = '8';
    } else if (sizeProp === 'sm') {
        size = '10';
    } else if (sizeProp === 'md') {
        size = '12';
    } else if (sizeProp === 'lg') {
        size = '20';
    }
    const w = 'w-'+size;
    const h = 'h-'+size;
    return [w, h];
}
