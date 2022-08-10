import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedElementState, isSvgElement, svgSelector } from "stores/element.store";
import { ColorResult, BlockPicker } from "react-color";
import { Slider } from "./slider";

export function SelectedSvg() {
  const fill = useRecoilValue(svgSelector("fill"));
  const stroke = useRecoilValue(svgSelector("stroke"));
  const strokeWidth = useRecoilValue(svgSelector("strokeWidth"));
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
              style={{ backgroundColor: fill }}
            />
            <div tabIndex={0} className="dropdown-content">
              <BlockPicker onChangeComplete={handleFillChange} color={fill} />
            </div>
          </div>
        </div>
        <div>
          <label className="label">Stroke</label>
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn w-20 h-18"
              style={{ backgroundColor: stroke }}
            />
            <div tabIndex={0} className="dropdown-content">
              <BlockPicker onChangeComplete={handleStrokeChange} color={stroke} />
            </div>
          </div>
        </div>
      </div>
      <Slider
        max={10}
        onChange={handleStrokeWidthChange}
        value={strokeWidth || 0}
        label="Stroke Width"
      />
    </div>
  );
}
