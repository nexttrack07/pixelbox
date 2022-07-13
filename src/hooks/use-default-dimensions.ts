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
      const src = get(imageSrcState(id));
      if (!src) return { width: 0, height: 0 };

      return getImageDimensions(src);
    },
});

function gcd(a: number, b: number): number {
  return b == 0 ? a : gcd(b, a % b);
}

const WIDTH = 900;
const HEIGHT = 750;

function getLowerValue(val: number, min: number): number {
  if (val <= min / 2) return val;

  return getLowerValue(val / 2, min);
}

export const useSetDefaultDimensions = (id: number) => {
  const imageDimensions = useRecoilValue(imageDimensionsState(id));
  let { width: w, height: h } = imageDimensions;

  let width = getLowerValue(w, WIDTH);
  let height = (width * h) / w;

  const setElement = useSetRecoilState(elementState(id));

  useEffect(() => {
    if (!width || !height) return;

    setElement((element) => {
      return {
        ...element,
        width,
        height,
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
