import { useRecoilValue, useSetRecoilState } from "recoil";
import { elementsState, selectedElementIdsState } from "stores/element.store";
import { Element } from "components";
import { Suspense } from "react";

export function Canvas() {
  const elements = useRecoilValue(elementsState);
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);

  return (
    <div
      className="relative bg-white h-[800px] w-[1000px]"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          setSelectedElement([]);
        }
      }}
    >
      {elements.map((element) => (
        <Suspense key={element} fallback={<div>Loading...</div>}>
          <Element id={element} />
        </Suspense>
      ))}
    </div>
  );
}
