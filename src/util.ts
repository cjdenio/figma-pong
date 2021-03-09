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
