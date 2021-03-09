function degToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

function radToDeg(rad: number) {
  return rad / (Math.PI / 180);
}

export function calculateOffset(angle: number, amount: number) {
  const rad = degToRad(angle);
  const cos = Math.cos(rad);
  const adj = cos * amount;

  const sin = Math.sin(rad);
  const opp = sin * amount;

  return [opp, -adj];
}

type Bounds = number[][];

export function getBounds(node: EllipseNode | RectangleNode): Bounds {
  return [
    [node.x, node.y],
    [node.x + node.width, node.y + node.height],
  ];
}

export function areBoundsTouching(a: Bounds, b: Bounds): boolean {
  if (a[1][0] < b[0][0] || a[0][0] > b[1][0]) {
    return false;
  }

  if (a[1][1] < b[0][1] || a[0][1] > b[1][1]) {
    return false;
  }

  return true;
}

export function calculateBallTrajectory(theta: number, xCoord: number): number {
  const rad = degToRad(theta);
  const tan = Math.tan(rad);

  return tan * xCoord;
}
