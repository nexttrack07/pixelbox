import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { elementsState, selectedElementIdsState } from "stores/element.store";
import {
  Template,
  Trash,
} from "tabler-icons-react";


export function Toolbar() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedElementIdsState);
  const setElementsState = useSetRecoilState(elementsState);

  function handleDeleteItems(e: React.MouseEvent) {
    e.stopPropagation();
    setElementsState((elements) => {
      return elements.filter((el) => !selectedItems.includes(el))
    });
    setSelectedItems([]);
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
    </div>
  );
}
