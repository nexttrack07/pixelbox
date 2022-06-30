import { Box } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  elementState,
  isSelectedState,
  selectedElementIdsState,
} from "stores/element.store";
import { useState } from "react";
import { useShiftKeyPressed } from "hooks";
import { Resizable } from "./resizable";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Draggable } from "./draggable";

type ElementProps = {
  id: number;
};

const Container = styled.div<{ mouseDown: boolean; isSelected: boolean }>`
  position: absolute;
  box-shadow: 0 0 0 0 transparent;
  border-radius: 20px;
  width: 200px;
  height: 170px;
  backdrop-filter: blur(10px);
  transition: 0.1s transform ease-out, 0.1s box-shadow ease-out,
    0.1s border-color ease-out;
  border: 2px solid ${(props) => (props.isSelected ? "skyblue" : "transparent")};
  background-color: lightgray;
  ${(props) =>
    props.mouseDown &&
    css`
      transform: scale(1.2);
      box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.3);
    `}
`;

export function Element({ id }: ElementProps) {
  const element = useRecoilValue(elementState(id));
  const [mouseDown, setMouseDown] = useState(false);
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);
  const isSelected = useRecoilValue(isSelectedState(id));
  const shiftKeyPressed = useShiftKeyPressed();

  if (element.type === "svg") {
    return (
      <Resizable id={id}>
        <Container
          style={{ ...element.style }}
          mouseDown={mouseDown}
          isSelected={isSelected}
          onMouseDown={() => {
            setSelectedElement((ids) => {
              // Do nothing if the element is already selected
              if (isSelected) return ids;

              // Add this element to the selection if shift is pressed
              if (shiftKeyPressed) return [...ids, id];

              // Otherwise, make this one the only selected element
              return [id];
            });
          }}
        >
          <Draggable id={id} mouseDown={mouseDown} setMouseDown={setMouseDown}>
            <div style={{ ...element.style }}>
              <div
                // ref={targetRef}
                dangerouslySetInnerHTML={{ __html: element.html }}
              />
            </div>
          </Draggable>
        </Container>
      </Resizable>
    );
  }

  return <Box bg="tomato" style={{ ...element.style, position: "absolute" }} />;
}
