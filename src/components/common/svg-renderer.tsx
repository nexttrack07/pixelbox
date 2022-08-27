import { SVGProps } from "react";
import { Curve, Point, SvgType } from "stores/element.store";

type Props = {
  svg: SvgType | Curve;
};

const svgMap: Record<SvgType["element"], (x: any) => JSX.Element> = {
  rect: (props: SVGProps<SVGRectElement>) => {
    return (
      <svg width="100%" height="100%">
        <rect
          width="100%"
          height="100%"
          stroke={props.stroke}
          fill={props.fill}
          strokeWidth={props.strokeWidth}
        />
      </svg>
    );
  },
  circle: (props: SVGProps<SVGCircleElement>) => (
    <svg width="100%" height="100%">
      <circle cx="50%" cy="50%" r="50%" {...props} />
    </svg>
  ),
  ellipse: (props: SVGProps<SVGEllipseElement>) => (
    <svg width="100%" height="100%">
      <ellipse cx="50%" rx="50%" cy="50%" ry="50%" {...props} />
    </svg>
  ),
  path: ({
    d,
    stroke = "#000",
    strokeWidth = 2,
    width = 200,
    height = 150,
  }: SVGProps<SVGPathElement>) => {
    return (
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <path
          d={`M0 0, C ${+width / 4} 0, ${+width / 10} ${+width / 10}, ${width} 0`}
          strokeWidth={strokeWidth}
          stroke={stroke}
          fill="none"
        />
      </svg>
    );
  },
};

function isCurve(item: SvgType | Curve): item is Curve {
  return item.element === "curve"
}

const pointsToPath = (points: Point[]) =>
  points.reduce((d, { position, control }) => !d
    ? `M${position.x},${position.y}`
    : d + ` Q${control.x},${control.y} ${position.x},${position.y}`
    , "")

export function SvgRenderer({ svg }: Props) {
  if (isCurve(svg)) {
    const w = svg.points.reduce((acc, p) => Math.max(acc, Math.max(p.position.x, p.control.x)), -Infinity)
    const h = svg.points.reduce((acc, p) => Math.max(acc, Math.max(p.position.y, p.control.y)), -Infinity)
    return (
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height="100%">
        <path d={pointsToPath(svg.points)} fill="none" stroke="#222" strokeWidth={4} />
      </svg>
    )
  }
  const { element, ...restProps } = svg;

  return svgMap[element](restProps);
}
