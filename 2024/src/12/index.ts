import fs from "fs";

const dirs: number[][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const part1 = (input: string) => {
  const grid = input.split("\n").map((line) => line.split(""));

  const regions: Record<string, number>[] = [];
  const visited: Record<string, boolean> = {};

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const key = `${x},${y}`;

      if (visited[key]) continue;

      const startingCell = grid[y][x];
      const region = {
        area: 0,
        perimeter: 0,
      };

      const explore = (x: number, y: number) => {
        const key = `${x},${y}`;
        const cell = grid[y]?.[x];

        if (!cell || visited[key] || cell !== startingCell) return;

        visited[key] = true;
        region.area++;

        const perimeter = dirs.reduce(
          (acc, dir) =>
            grid[y + dir[0]]?.[x + dir[1]] === cell ? acc - 1 : acc,
          4,
        );
        region.perimeter += perimeter;

        for (const [dy, dx] of dirs) {
          explore(x + dx, y + dy);
        }
      };

      explore(x, y);
      if (region.area > 0) {
        regions.push(region);
      }
    }
  }

  let total = 0;
  for (const region of regions) {
    total += region.area * region.perimeter;
  }
  return total;
};

const part2 = (input: string) => {
  return null;
};

const input = fs.readFileSync("./testInput.txt", "utf8").trim();
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
