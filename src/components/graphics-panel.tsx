import { useRecoilState, useSetRecoilState } from "recoil";
import { elementsState, elementState, Rect } from "stores/element.store";
import { SvgRenderer } from "./common/svg-renderer";


const svgObj: Rect = {
  element: "rect",
  fill: "yellow",
  rx: 10,
}

export function GraphicsPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const setElementState = useSetRecoilState(elementState(elements.length));

  function handleAddElement() {
    const newId = elements.length;
    setElements((elements) => [...elements, newId]);
    setElementState({
      type: "svg",
      top: 100,
      left: 100,
      height: 100,
      width: 300,
      rotation: 0,
      ...svgObj
    });
  }

  return (
    <>
      <div className="flex space-x-2 space-y-2 flex-wrap p-4 justify-center">
        <button onClick={handleAddElement} className="w-24 h-24 text-gray-100">
          <SvgRenderer svg={svgObj} />
        </button>
      </div>
    </>
  );
}
