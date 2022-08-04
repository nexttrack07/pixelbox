import { SVGProps } from "react";
import { Rect } from "stores/element.store";


const svgMap = {
  "rect": (props: SVGProps<SVGRectElement>) => <rect width="100%" height="100%" {...props} />
}

export function SvgRenderer({ svg }: { svg: Rect }) {
  const { element, ...restProps } = svg;
  return (
    <svg width="100%" height="100%">
      {svgMap[element](restProps)}
    </svg>
  )
}