import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { elementsState, selectedElementIdsState, Element, selectedElementType } from "stores/element.store";
import { Trash } from "tabler-icons-react";
import { SvgToolbar } from "./svg-toolbar";

const selectedToolbarMap: Record<Element["type"], JSX.Element> = {
  rectangle: <div>Rectangle selected</div>,
  image: <div>Image selected</div>,
  svg: <SvgToolbar />,
  text: <div>Text Selected</div>,
  textBase: <div>Text Selected</div>
}

export function Toolbar() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedElementIdsState);
  const setElementsState = useSetRecoilState(elementsState);
  const selectedElement = useRecoilValue(selectedElementType);

  function handleDeleteItems(e: React.MouseEvent) {
    e.stopPropagation();
    setElementsState((elements) => {
      return elements.filter((el) => !selectedItems.includes(el));
    });
    setSelectedItems([]);
  }

  return (
    <div className="flex w-full items-center p-4">
      <div className="flex-1">
        {selectedElement && selectedToolbarMap[selectedElement]}
      </div>
      <div className="space-x-4 flex">
        <button
          disabled={selectedItems.length === 0}
          onClick={handleDeleteItems}
          className="btn btn-outline"
          aria-label="trash icon"
        >
          <Trash />
        </button>
      </div>
    </div>
  );
}
