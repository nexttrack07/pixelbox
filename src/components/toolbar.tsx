import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { canvasState, elementsState, selectedElementIdsState } from "stores/element.store";
import {
  FileDatabase,
  Template,
  Trash,
} from "tabler-icons-react";

function SaveTemplate() {
  const canvas = useRecoilValue(canvasState);

  function handleSaveTemplate() {
    localStorage.setItem("random_canvas", JSON.stringify(canvas));
  }

  return (
    <button
      onClick={handleSaveTemplate}
      className="btn btn-outline"
    >
      <FileDatabase />
      Save Template
    </button>
  );
}

export function Toolbar() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedElementIdsState);
  const setElementsState = useSetRecoilState(elementsState);
  const setCanvas = useSetRecoilState(canvasState);

  function handleDeleteItems(e: React.MouseEvent) {
    console.log("Delete Button clicked")
    e.stopPropagation();
    setElementsState((elements) => {
      return elements.filter((el) => !selectedItems.includes(el))
    });
    setSelectedItems([]);
  }

  function handleGetTemplate() {
    const jsonCanvasItem = localStorage.getItem("random_canvas");

    if (jsonCanvasItem) {
      setCanvas(JSON.parse(jsonCanvasItem));
    }
  }

  return (
    <div className="flex w-full items-center p-2">
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
      <div className="flex-1" />
      <div className="flex items-center space-x-2">
        <button
          className="btn btn-outline"
          onClick={handleGetTemplate}
        >
          <Template />
          Get Template
        </button>
        <SaveTemplate />
      </div>
    </div>
  );
}
