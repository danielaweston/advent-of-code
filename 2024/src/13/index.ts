import fs from "fs";

type Button = {
  x: number;
  y: number;
  cost: number;
};

type ClawMachine = {
  buttonA: Button;
  buttonB: Button;
  prize: {
    x: number;
    y: number;
  };
};

function parseInput(input: string): ClawMachine[] {
  const machines = input.split("\n\n");

  return machines.map((machineStr) => {
    const lines = machineStr
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const buttonAMatch =
      lines[0].match(/Button A: X\+(\d+), Y\+(\d+)/)?.map(Number) || [];
    const buttonBMatch =
      lines[1].match(/Button B: X\+(\d+), Y\+(\d+)/)?.map(Number) || [];
    const prizeMatch =
      lines[2].match(/Prize: X=(\d+), Y=(\d+)/)?.map(Number) || [];

    return {
      buttonA: {
        x: buttonAMatch[1],
        y: buttonAMatch[2],
        cost: 3,
      },
      buttonB: {
        x: buttonBMatch[1],
        y: buttonBMatch[2],
        cost: 1,
      },
      prize: {
        x: prizeMatch[1],
        y: prizeMatch[2],
      },
    };
  });
}

const playMachine = (machine: ClawMachine) => {
  const { buttonA, buttonB, prize } = machine;
  const { x: targetX, y: targetY } = prize;

  const maxPress = 100;

  let bestCost = Infinity;
  const visited: Record<string, boolean> = {};

  function play(node: Record<string, number>) {
    const { a, b } = node;
    const key = `${a},${b}`;

    if (visited[key]) {
      return;
    }

    visited[key] = true;

    const currentX = buttonA.x * a + buttonB.x * b;
    const currentY = buttonA.y * a + buttonB.y * b;

    if (currentX > targetX || currentY > targetY) {
      return;
    }

    if (currentX === targetX && currentY === targetY) {
      const cost = 3 * a + b;

      if (cost < bestCost) {
        bestCost = cost;
      }
      return;
    }

    play({ a: a + 1, b: b });
    play({ a: a, b: b + 1 });
  }

  play({ a: 0, b: 0 });

  return bestCost;
};

const part1 = (input: string) => {
  const machines = parseInput(input);

  let total = 0;

  for (const machine of machines) {
    const result = playMachine(machine);

    if (result < Infinity) total += result;
  }

  return total;
};

const part2 = (input: string) => {
  const machines = parseInput(input);

  let total = 0;

  for (const machine of machines) {
    machine.prize = {
      x: parseInt(`1000000000${machine.prize.x}`),
      y: parseInt(`1000000000${machine.prize.y}`),
    };

    const result = playMachine(machine);

    if (result < Infinity) total += result;
  }

  return total;
};

const input = fs.readFileSync("./input.txt", "utf8").trim();
console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
