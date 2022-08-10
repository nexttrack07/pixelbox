import { TwitterPicker, ColorResult } from "react-color";
import { useRecoilValue, useSetRecoilState } from "recoil"
import { isSvgElement, selectedElementState, svgSelector } from "stores/element.store"
import { BorderOuter, CircleOff, LineDashed, LineDotted, Rectangle } from "tabler-icons-react";

export const SvgToolbar = () => {
  const fill = useRecoilValue(svgSelector("fill"));
  const stroke = useRecoilValue(svgSelector("stroke"));
  const strokeWidth = useRecoilValue(svgSelector("strokeWidth"));
  const setSelectedElement = useSetRecoilState(selectedElementState);

  const handleColorChange = (prop: "stroke" | "fill") => (color: ColorResult) => {
    setSelectedElement(el => {
      if (isSvgElement(el)) {
        return {
          ...el,
          [prop]: color.hex
        }
      }

      return el;
    })
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="dropdown">
        <label tabIndex={0}>
          <div style={{ borderColor: stroke }} className="bg-none rounded border-4 w-10 h-10" />
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
            <div className="flex flex-col space-y-2 my-4">
              <div className="flex items-center justify-between">
                <label className="label text-base">Border Weight</label>
                <input value={strokeWidth} className="input input-bordered input-sm w-16" />
              </div>
              <input value={strokeWidth} type="range" className="range range-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}