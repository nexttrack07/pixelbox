import { useRecoilValue, useSetRecoilState } from "recoil";
import { elementsState, selectedElementIdsState } from "stores/element.store";
import { Element } from "components";
import React, { Suspense } from "react";
import { SelectHandler } from "./select-handler";

export function Canvas() {
  const elements = useRecoilValue(elementsState);
  const setSelectedElementIds = useSetRecoilState(selectedElementIdsState);

  function handleCanvasClick(e: React.MouseEvent) {
    console.log("canvas clicked");
    setSelectedElementIds([]);
  }

  return (
    <div
      onClick={handleCanvasClick}
      className="relative bg-white h-[800px] w-[1000px]"
    >
      {elements.map((element) => (
        <Suspense key={element} fallback={<div>Loading...</div>}>
          <Element id={element} />
        </Suspense>
      ))}
      <SelectHandler />
    </div>
  );
}
