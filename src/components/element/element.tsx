import { Box } from "@chakra-ui/react";
import {
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  CommonState,
  ElementState,
  elementState,
  ImageState,
  isSelectedState,
  selectedElementIdsState,
} from "stores/element.store";
import { Suspense, useEffect, useState } from "react";
import { useShiftKeyPressed } from "hooks";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";

type ElementProps = {
  id: number;
};

/**
 * Returns the width and height for the specified image.
 */
export const getImageDimensions = (src: string) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = (error) => {
      reject(error);
    };
    image.src = src;
  });
};

const imageSizeState = selectorFamily({
  key: "imageSize",
  get: (src: string) => () => {
    if (!src) return;

    return getImageDimensions(src);
  },
});

export function Element({ id }: ElementProps) {
  const element = useRecoilValue(elementState(id));

  function renderElementComponent() {
    if (element.type === "svg") {
      return (
        <Suspense fallback={<div>Loading image size...</div>}>
          <ImageContainer url={element.src} html={element.html} id={id} />
        </Suspense>
      );
    } else if (element.type === "text") {
      return <Box sx={{ fontSize: element.fontSize }}>{element.content}</Box>;
    }

    return null;
  }

  return renderElementComponent();
}

function ImageContainer({ url, html, id }: { url: string; html: string; id: number }) {
  const imageSize = useRecoilValue(imageSizeState(url));
  const [element, setElement] = useRecoilState(elementState(id));
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);
  const isSelected = useRecoilValue(isSelectedState(id));
  const shiftKeyPressed = useShiftKeyPressed();

  const handleMouseDown = () => {
    setSelectedElement((ids) => {
      if (isSelected) return ids;

      if (shiftKeyPressed) return [...ids, id];

      return [id];
    });
  };

  useEffect(() => {
    if (imageSize) {
      console.log("changing size...");
      setElement((element) => ({
        ...element,
        style: {
          ...element.style,
          height: imageSize.height,
          width: imageSize.width,
        },
      }));
    }
  }, [imageSize]);

  const handleResize: RndResizeCallback = (e, dir, ref, delta, position) => {
    setElement((element) => ({
      ...element,
      style: {
        ...element.style,
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      },
    }));
  };

  const handleDrag: RndDragCallback = (e, data) => {
    setElement((element) => ({
      ...element,
      style: {
        ...element.style,
        left: data.x,
        top: data.y,
      },
    }));
  };

  return (
    <Rnd
      size={{ width: element.style.width, height: element.style.height }}
      position={{ x: element.style.left, y: element.style.top }}
      // default={{
      //   width: element.style.width,
      //   height: element.style.height,
      //   x: element.style.left,
      //   y: element.style.top,
      // }}
      onResize={handleResize}
      onDrag={handleDrag}
      onMouseDown={handleMouseDown}
      lockAspectRatio
      resizeHandleStyles={resizeHandleStyles}
      style={{ padding: 5 }}
      resizeHandleWrapperStyle={{ display: isSelected ? "block" : "none" }}
      bounds="parent"
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Rnd>
  );
}

const resizeHandleStyles = {
  bottomRight: {
    height: 15,
    width: 15,
    backgroundColor: "white",
    boxShadow: "0px 0px 1px rgba(0,0,0,.5)",
    borderRadius: "100%",
    border: "1px solid gray",
  },
  bottomLeft: {
    height: 15,
    width: 15,
    backgroundColor: "white",
    boxShadow: "0px 0px 1px rgba(0,0,0,.5)",
    borderRadius: "100%",
    border: "1px solid gray",
  },
  topLeft: {
    height: 15,
    width: 15,
    backgroundColor: "white",
    boxShadow: "0px 0px 1px rgba(0,0,0,.5)",
    borderRadius: "100%",
    border: "1px solid gray",
  },
  topRight: {
    height: 15,
    width: 15,
    backgroundColor: "white",
    boxShadow: "0px 0px 1px rgba(0,0,0,.5)",
    borderRadius: "100%",
    border: "1px solid gray",
  },
  top: { backgroundColor: "#6095eb", height: 4 },
  left: { backgroundColor: "#6095eb", width: 4 },
  bottom: { backgroundColor: "#6095eb", height: 4 },
  right: { backgroundColor: "#6095eb", width: 4 },
};
