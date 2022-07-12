import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { elementState, isSelectedState, selectedElementIdsState } from "stores/element.store";
import { useSetDefaultDimensions, useShiftKeyPressed } from "hooks";
import { Dimension, Moveable, Position } from "./moveable";
import { TextComponent } from "./text-component";

type ElementProps = {
  id: number;
};

export function Element({ id }: ElementProps) {
  const [element, setElement] = useRecoilState(elementState(id));
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);
  const isSelected = useRecoilValue(isSelectedState(id));
  const shiftKeyPressed = useShiftKeyPressed();
  const [showHandlers, setShowHandlers] = useState(true);
  useSetDefaultDimensions(id);

  function handleSelectElement() {
    setSelectedElement((ids) => {
      if (isSelected) return ids;

      if (shiftKeyPressed) return [...ids, id];

      return [id];
    });
  }

  function renderElement() {
    if (element.type === "svg") {
      return <div dangerouslySetInnerHTML={{ __html: element.html }} />;
    } else if (element.type === "text") {
      return <TextComponent id={id} onSelect={handleSelectElement} element={element} />;
    } else {
      return <Box>Type: {element.type}</Box>;
    }
  }

  return renderElement();
}
