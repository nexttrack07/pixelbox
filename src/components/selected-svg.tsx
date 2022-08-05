import { selector, useRecoilValue, useSetRecoilState } from "recoil";
import {
  Element,
  selectedElementState,
  SvgElement,
} from "stores/element.store";
import { ColorResult, BlockPicker } from "react-color";
import { Slider } from "./slider";

function isSvgElement(element?: Element): element is SvgElement {
  return element?.type === "svg";
}

const svgPropsSelector = selector({
  key: "svgProps",
  get: ({ get }) => {
    const selectedElement = get(selectedElementState);

    if (isSvgElement(selectedElement)) {
      const { fill, stroke, strokeWidth } = selectedElement;

      return {
        fill,
        stroke,
        strokeWidth,
      };
    }

    return;
  },
});

export function SelectedSvg() {
  const svgProps = useRecoilValue(svgPropsSelector);
  const setSelectedElement = useSetRecoilState(selectedElementState);

  function handleFillChange(color: ColorResult) {
    setSelectedElement((el) => {
      if (isSvgElement(el)) {
        return {
          ...el,
          fill: color.hex,
        };
      }

      return el;
    });
  }

  function handleStrokeChange(color: ColorResult) {
    setSelectedElement((el) => {
      if (isSvgElement(el)) {
        return {
          ...el,
          stroke: color.hex,
        };
      }

      return el;
    });
  }

  function handleStrokeWidthChange(val: number) {
    setSelectedElement((el) => {
      if (isSvgElement(el)) {
        return {
          ...el,
          strokeWidth: val,
          stroke: el.stroke ? el.stroke : "#000",
        };
      }

      return el;
    });
  }

  return (
    <div className="flex flex-col p-6 space-y-4">
      <span className="text-xl">Svg Properties</span>
      <div className="flex items-center space-x-8">
        <div>
          <label className="label">Fill</label>
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn w-20 h-18"
              style={{ backgroundColor: svgProps?.fill }}
            />
            <div tabIndex={0} className="dropdown-content">
              <BlockPicker
                onChangeComplete={handleFillChange}
                color={svgProps?.fill}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="label">Stroke</label>
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn w-20 h-18"
              style={{ backgroundColor: svgProps?.stroke }}
            />
            <div tabIndex={0} className="dropdown-content">
              <BlockPicker
                onChangeComplete={handleStrokeChange}
                color={svgProps?.stroke}
              />
            </div>
          </div>
        </div>
      </div>
      <Slider
        max={10}
        onChange={handleStrokeWidthChange}
        value={svgProps?.strokeWidth || 0}
        label="Stroke Width"
      />
    </div>
  );
}
