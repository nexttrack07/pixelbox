import { InputSlider } from "components/common/input-slider";
import { TwitterPicker, ColorResult } from "react-color";
import { useRecoilState } from "recoil";
import { svgSelector } from "stores/element.store";
import {
  BorderOuter,
  CircleOff,
  LineDashed,
  LineDotted,
  Rectangle,
} from "tabler-icons-react";

export const SvgToolbar = () => {
  const [fill, setFill] = useRecoilState(svgSelector("fill"));
  const [stroke, setStroke] = useRecoilState(svgSelector("stroke"));
  const [strokeWidth, setStrokeWidth] = useRecoilState(svgSelector("strokeWidth"));

  const handleColorChange = (prop: "stroke" | "fill") => (color: ColorResult) => {
    if (prop === "fill") {
      setFill(color);
    } else {
      setStroke(color);
    }
  };

  const handleStrokeWidthChange = (val: string | number) => {
    setStrokeWidth(val);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="dropdown">
        <label tabIndex={0}>
          <div
            style={{ borderColor: stroke }}
            className="bg-none rounded border-4 w-10 h-10"
          />
        </label>
        <div tabIndex={0} className="dropdown-content mt-4">
          <TwitterPicker onChangeComplete={handleColorChange("stroke")} color={stroke} />
        </div>
      </div>
      <div className="dropdown">
        <label tabIndex={0}>
          <div style={{ backgroundColor: fill }} className="w-10 h-10 rounded" />
        </label>
        <div tabIndex={0} className="dropdown-content mt-4">
          <TwitterPicker onChangeComplete={handleColorChange("fill")} color={fill} />
        </div>
      </div>
      <div className="dropdown">
        <label className="btn btn-outline" tabIndex={0}>
          <BorderOuter />
        </label>
        <div className="dropdown-content card card-compact bg-slate-800 border mt-1 border-slate-500 w-80 rounded">
          <div className="card-body">
            <div className="flex items-center justify-evenly">
              <button className="btn btn-outline">
                <CircleOff />
              </button>
              <button className="btn btn-outline">
                <Rectangle />
              </button>
              <button className="btn btn-outline">
                <LineDashed />
              </button>
              <button className="btn btn-outline">
                <LineDotted />
              </button>
            </div>
            <InputSlider label="Border Weight" value={strokeWidth} onChange={handleStrokeWidthChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
