import { useEffect } from "react";
import { selectorFamily, useRecoilValue, useSetRecoilState } from "recoil";
import { elementState } from "stores/element.store";

const imageSrcState = selectorFamily({
  key: "imageSrc",
  get:
    (id: number) =>
    ({ get }) => {
      const element = get(elementState(id));
      if (element.type === "image" || element.type === "svg") {
        return element.src;
      }

      return null;
    },
});

const imageDimensionsState = selectorFamily({
  key: "imageDimensions",
  get:
    (id: number) =>
    ({ get }) => {
      console.log("image dimensions");
      const src = get(imageSrcState(id));
      if (!src) return null;

      return getImageDimensions(src);
    },
});

export const useSetDefaultDimensions = (id: number) => {
  const imageDimensions = useRecoilValue(imageDimensionsState(id));
  const width = imageDimensions?.width;
  const height = imageDimensions?.height;

  const setElement = useSetRecoilState(elementState(id));

  useEffect(() => {
    if (!width || !height) return;

    setElement((element) => {
      return {
        ...element,
        style: {
          ...element.style,
          width,
          height,
        },
      };
    });
  }, [width, height, setElement]);
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
