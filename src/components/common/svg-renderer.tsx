import { SVGProps } from "react";
import { SvgType } from "stores/element.store";

type Props = {
  svg: SvgType;
};

const svgMap: Record<SvgType["element"], (x: any) => JSX.Element> = {
  rect: (props: SVGProps<SVGRectElement>) => (
    <rect width="100%" height="100%" {...props} />
  ),
  circle: (props: SVGProps<SVGCircleElement>) => (
    <circle cx="50%" cy="50%" r="50%" {...props} />
  ),
  ellipse: (props: SVGProps<SVGEllipseElement>) => (
    <ellipse cx="50%" rx="50%" cy="50%" ry="50%"  {...props} />
  ),
};

export function SvgRenderer({ svg }: Props) {
  const { element, ...restProps } = svg;
  return (
    <svg width="100%" height="100%">
      {svgMap[element](restProps)}
    </svg>
  );
}
