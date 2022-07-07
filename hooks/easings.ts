// https://stackoverflow.com/questions/46624541/how-to-calculate-this-constant-in-various-easing-functions
/** Some precomputed estimations, it seems  */
const BOUNCE = 1.70158;
const OVERSHOOT = 1.525;

export const linear = (n: number): number => n;

export const inQuad = (n: number): number => n * n;

export const outQuad = (n: number): number => {
  return n * (2 - n);
};

export const inOutQuad = (n: number): number => {
  n *= 2;
  if (n < 1) return 0.5 * n * n;
  return -0.5 * (--n * (n - 2) - 1);
};

export const inCube = (n: number): number => {
  return n * n * n;
};

export const outCube = (n: number): number => {
  return --n * n * n + 1;
};

export const inOutCube = (n: number): number => {
  n *= 2;
  if (n < 1) return 0.5 * n * n * n;
  return 0.5 * ((n -= 2) * n * n + 2);
};

export const inQuart = (n: number): number => {
  return n * n * n * n;
};

export const outQuart = (n: number): number => {
  return 1 - (--n * n * n * n);
};

export const inOutQuart = (n: number): number => {
  n *= 2;
  if (n < 1) return 0.5 * n * n * n * n;
  return -0.5 * ((n -= 2) * n * n * n - 2);
};

export const inQuint = (n: number): number => {
  return n * n * n * n * n;
};

export const outQuint = (n: number): number => {
  return --n * n * n * n * n + 1;
};

export const inOutQuint = (n: number): number => {
  n *= 2;
  if (n < 1) return 0.5 * n * n * n * n * n;
  return 0.5 * ((n -= 2) * n * n * n * n + 2);
};

export const inSine = (n: number): number => {
  return 1 - Math.cos(n * Math.PI / 2);
};

export const outSine = (n: number): number => {
  return Math.sin(n * Math.PI / 2);
};

export const inOutSine = (n: number): number => {
  return .5 * (1 - Math.cos(Math.PI * n));
};

export const inExpo = (n: number): number => {
  return 0 == n ? 0 : Math.pow(1024, n - 1);
};

export const outExpo = (n: number): number => {
  return 1 == n ? n : 1 - Math.pow(2, -10 * n);
};

export const inOutExpo = (n: number): number => {
  if (0 == n) return 0;
  if (1 == n) return 1;
  if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
  return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
};

export const inCirc = (n: number): number => {
  return 1 - Math.sqrt(1 - n * n);
};

export const outCirc = (n: number): number => {
  return Math.sqrt(1 - (--n * n));
};

export const inOutCirc = (n: number): number => {
  n *= 2;
  if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
  return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
};

export const inBack = (n: number): number => {
  return n * n * ((BOUNCE + 1) * n - BOUNCE);
};

export const outBack = (n: number): number => {
  return --n * n * ((BOUNCE + 1) * n + BOUNCE) + 1;
};

export const inOutBack = (n: number): number => {
  const s = BOUNCE * OVERSHOOT;
  if ((n *= 2) < 1) return 0.5 * (n * n * ((s + 1) * n - s));
  return 0.5 * ((n -= 2) * n * ((s + 1) * n + s) + 2);
};

export const inBounce = (n: number): number => {
  return 1 - outBounce(1 - n);
};

export const outBounce = (n: number): number => {
  if (n < (1 / 2.75)) {
    return 7.5625 * n * n;
  } else if (n < (2 / 2.75)) {
    return 7.5625 * (n -= 1.5 / 2.75) * n + 0.75;
  } else if (n < (2.5 / 2.75)) {
    return 7.5625 * (n -= 2.25 / 2.75) * n + 0.9375;
  } else {
    return 7.5625 * (n -= 2.625 / 2.75) * n + 0.984375;
  }
};

export const inOutBounce = (n: number): number => {
  if (n < .5) return inBounce(n * 2) * .5;
  return outBounce(n * 2 - 1) * .5 + .5;
};

export const inElastic = (n: number): number => {
  let a = 1;
  const p = 0.4;
  const s = 0.1;

  if (n === 0) return 0;
  if (n === 1) return 1;

  return -(a * Math.pow(2, 10 * (n -= 1)) *
    Math.sin((n - s) * (2 * Math.PI) / p));
};

// export const outElastic = (n: number): number => {
//   var s, a = 0.1, p = 0.4;
//   if (n === 0) return 0;
//   if (n === 1) return 1;
//   if (!a || a < 1) {
//     a = 1;
//     s = p / 4;
//   } else s = p * Math.asin(1 / a) / (2 * Math.PI);
//   return (a * Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) +
//     1);
// };

// export const inOutElastic = (n: number): number => {
//   var s, a = 0.1, p = 0.4;
//   if (n === 0) return 0;
//   if (n === 1) return 1;
//   if (!a || a < 1) {
//     a = 1;
//     s = p / 4;
//   } else s = p * Math.asin(1 / a) / (2 * Math.PI);
//   if ((n *= 2) < 1) {
//     return -0.5 *
//       (a * Math.pow(2, 10 * (n -= 1)) *
//         Math.sin((n - s) * (2 * Math.PI) / p));
//   }
//   return a * Math.pow(2, -10 * (n -= 1)) *
//       Math.sin((n - s) * (2 * Math.PI) / p) * 0.5 + 1;
// };
