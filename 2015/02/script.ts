
type PresentDimensions = {
    length: number;
    width: number;
    height: number;
}

export function extractDimension(dimension: string): PresentDimensions {
    const [length, width, height] = dimension.split('x').map(Number);
    return { length, width, height };
}

export function calculateNecessaryPaper(dimension: PresentDimensions): number {
    const { length, width, height } = dimension;
    const sides = [length * width, width * height, height * length];
    return 2 * sides.reduce((acc, side) => acc + side, 0) + Math.min(...sides);
}

export function calculateNecessaryRibbon(dimension: PresentDimensions): number {
    const { length, width, height } = dimension;
    const [side1, side2] = [length, width, height].sort((a, b) => a - b).slice(0, 2);
    return 2 * (side1 + side2) + length * width * height;
}