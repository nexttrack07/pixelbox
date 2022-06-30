import { Box } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  elementState,
  isSelectedState,
  selectedElementIdsState,
} from "stores/element.store";
import { useState } from "react";
import { useShiftKeyPressed } from "hooks";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";

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
  const [element, setElement] = useRecoilState(elementState(id));
  const [mouseDown, setMouseDown] = useState(false);
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);
  const isSelected = useRecoilValue(isSelectedState(id));
  const shiftKeyPressed = useShiftKeyPressed();

  const handleResize: RndResizeCallback = (e, dir, ref, delta, position) => {
    setElement(element => ({
      ...element,
      style: {
        ...element.style,
        width: ref.offsetWidth,
        height: ref.offsetHeight
      }
    }))
  }

  const handleDrag: RndDragCallback = (e, data) => {
    setElement(element => ({
      ...element,
      style: {
        ...element.style,
        left: data.x,
        top: data.y
      }
    }))
  }

  const handleMouseDown = () => {
    setSelectedElement(ids => {
      if (isSelected) return ids

      if (shiftKeyPressed) return [...ids, id]

      return [id]
    })
  }

  if (element.type === "svg") {
    return (
      <Rnd
        default={{  width: element.style.width, height: element.style.height,  x: element.style.left, y: element.style.top,  }}
        onResize={handleResize}
        onDrag={handleDrag}
        onMouseDown={handleMouseDown}
        lockAspectRatio
        resizeHandleStyles={{
          bottomRight: { height: 15, width: 15, backgroundColor: 'white', boxShadow: '0px 0px 1px rgba(0,0,0,.5)', borderRadius: '100%', border: '1px solid gray' },
          bottomLeft: { height: 15, width: 15, backgroundColor: 'white', boxShadow: '0px 0px 1px rgba(0,0,0,.5)', borderRadius: '100%', border: '1px solid gray' },
          topLeft: { height: 15, width: 15, backgroundColor: 'white', boxShadow: '0px 0px 1px rgba(0,0,0,.5)', borderRadius: '100%', border: '1px solid gray' },
          topRight: { height: 15, width: 15, backgroundColor: 'white', boxShadow: '0px 0px 1px rgba(0,0,0,.5)', borderRadius: '100%', border: '1px solid gray' },
          top: { backgroundColor: '#6095eb', height: 4 },
          left: { backgroundColor: '#6095eb', width: 4 },
          bottom: { backgroundColor: '#6095eb', height: 4 },
          right: { backgroundColor: '#6095eb', width: 4 },
        }}
        style={{ padding: 5 }}
        resizeHandleWrapperStyle={{ display: isSelected ? 'block' : 'none' }}
        bounds='parent'
      >
        <div
          dangerouslySetInnerHTML={{ __html: element.html }}
        />
      </Rnd>
    );
  }

  return <Box bg="tomato" style={{ ...element.style, position: "absolute" }} />;
}
