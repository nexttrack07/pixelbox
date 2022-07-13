import { useRecoilState, useSetRecoilState } from "recoil";
import { elementsState, elementState } from "stores/element.store";
import bottle from "../bottle.png";
import espresso from "../espresso.jpeg";

const images = [
  { id: "bottle", url: bottle },
  { id: "espresso", url: espresso },
];

export function PhotosPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const setElementState = useSetRecoilState(elementState(elements.length));

  function handleAddElement(url: string) {
    const newId = elements.length;
    setElements((elements) => [...elements, newId]);

    setElementState({
      type: "image",
      top: 100,
      left: 100,
      height: 100,
      width: 100,
      rotation: 0,
      src: url,
    });
  }

  return (
    <div className="flex flex-wrap space-x-2">
      {images.map((image) => (
        <div
          onClick={() => handleAddElement(image.url)}
          className="cursor-pointer avatar"
          key={image.id}
        >
          <div className="w-24">
            <img src={image.url} />
          </div>
        </div>
      ))}
    </div>
  );
}
