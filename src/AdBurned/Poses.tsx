import React from "react";

// Joint-based stick figure. Coordinates are relative to the hip (y up is
// negative); a pose is a set of joint positions, so poses can be blended.
export type Pose = {
  head: [number, number];
  neck: [number, number];
  handL: [number, number];
  handR: [number, number];
  kneeL: [number, number];
  footL: [number, number];
  kneeR: [number, number];
  footR: [number, number];
};

const lerp2 = (a: [number, number], b: [number, number], t: number): [number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

export const blend = (a: Pose, b: Pose, t: number): Pose => {
  const out = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => (out[k] = lerp2(a[k], b[k], t)));
  return out;
};

export const POSES = {
  stand: { head: [0, -232], neck: [0, -196], handL: [-34, -70], handR: [34, -70], kneeL: [-14, 62], footL: [-18, 124], kneeR: [14, 62], footR: [18, 124] },
  // Ronaldo free-kick stance: legs wide, arms down and out, chest up.
  power: { head: [0, -240], neck: [0, -204], handL: [-62, -64], handR: [62, -64], kneeL: [-48, 60], footL: [-78, 124], kneeR: [48, 60], footR: [78, 124] },
  runA: { head: [26, -226], neck: [18, -192], handL: [-46, -118], handR: [70, -78], kneeL: [44, 46], footL: [26, 116], kneeR: [-22, 66], footR: [-70, 98] },
  runB: { head: [26, -226], neck: [18, -192], handL: [62, -118], handR: [-46, -78], kneeL: [-22, 66], footL: [-70, 98], kneeR: [44, 46], footR: [26, 116] },
  windup: { head: [-12, -226], neck: [-8, -192], handL: [-96, -150], handR: [92, -128], kneeL: [10, 62], footL: [14, 124], kneeR: [-62, 40], footR: [-134, 6] },
  kick: { head: [-34, -218], neck: [-26, -186], handL: [-104, -138], handR: [64, -176], kneeL: [4, 62], footL: [2, 124], kneeR: [70, -26], footR: [150, -126] },
  siu: { head: [0, -244], neck: [0, -208], handL: [-128, -44], handR: [128, -44], kneeL: [-62, 58], footL: [-100, 124], kneeR: [62, 58], footR: [100, 124] },
  jump: { head: [0, -244], neck: [0, -208], handL: [-40, -300], handR: [40, -300], kneeL: [-24, 46], footL: [-30, 96], kneeR: [24, 46], footR: [30, 96] },
  alarmed: { head: [0, -236], neck: [0, -200], handL: [-70, -270], handR: [70, -270], kneeL: [-22, 60], footL: [-30, 124], kneeR: [22, 60], footR: [30, 124] },
  highFiveL: { head: [12, -232], neck: [8, -196], handL: [-40, -80], handR: [96, -300], kneeL: [-10, 62], footL: [-30, 124], kneeR: [28, 60], footR: [40, 124] },
} satisfies Record<string, Pose>;

export const StickFigure: React.FC<{
  pose: Pose;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  color?: string;
  headFill?: string;
  hardHat?: boolean;
  tie?: boolean;
  stroke?: number;
}> = ({ pose, x, y, scale = 1, flip = false, color = "#fff", headFill = "#0a2a6b", hardHat, tie, stroke = 9 }) => {
  const p = pose;
  const sh: [number, number] = lerp2(p.neck, [0, 0], 0.18);
  const line = (a: [number, number], b: [number, number]) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={line(p.neck, [0, 0])} />
      <path d={`${line(sh, p.handL)} ${line(sh, p.handR)}`} />
      <path d={`M0 0 L${p.kneeL[0]} ${p.kneeL[1]} L${p.footL[0]} ${p.footL[1]} M0 0 L${p.kneeR[0]} ${p.kneeR[1]} L${p.footR[0]} ${p.footR[1]}`} />
      <circle cx={p.head[0]} cy={p.head[1]} r={34} fill={headFill} />
      {hardHat ? (
        <path
          d={`M${p.head[0] - 44} ${p.head[1] - 10} Q${p.head[0]} ${p.head[1] - 62} ${p.head[0] + 44} ${p.head[1] - 10} Z`}
          fill="#ffb21a"
          stroke="#111"
          strokeWidth={5}
        />
      ) : null}
      {tie ? <path d={`M${p.neck[0]} ${p.neck[1] + 6} l-10 24 l10 26 l10 -26 Z`} fill="#e3161b" stroke="#111" strokeWidth={3} /> : null}
    </g>
  );
};
