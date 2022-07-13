import { Box } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { elementState, isSelectedState, selectedElementIdsState } from "stores/element.store";
import { useShiftKeyPressed } from "hooks";
import { TextContainer } from "./text-container";
import { SvgContainer } from "./svg-container";
import { ImageContainer } from "./image-container";

type ElementProps = {
  id: number;
};

export function Element({ id }: ElementProps) {
  const element = useRecoilValue(elementState(id));
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);
  const isSelected = useRecoilValue(isSelectedState(id));
  const shiftKeyPressed = useShiftKeyPressed();

  function handleSelectElement() {
    setSelectedElement((ids) => {
      if (isSelected) return ids;

      if (shiftKeyPressed) return [...ids, id];

      return [id];
    });
  }

  function renderElement() {
    if (element.type === "svg") {
      return <SvgContainer id={id} onSelect={handleSelectElement} element={element} />;
    } else if (element.type === "text") {
      return <TextContainer id={id} onSelect={handleSelectElement} element={element} />;
    } else if (element.type === "image") {
      return <ImageContainer id={id} onSelect={handleSelectElement} element={element} />;
    } else {
      return <Box>Type: {element.type}</Box>;
    }
  }

  return renderElement();
}
