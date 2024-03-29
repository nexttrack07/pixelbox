import { useSetRecoilState, useRecoilValue, selector } from "recoil";
import { elementsState, elementState, TextElementBase } from "stores/element.store";

const elementsLength = selector({
  key: "elementsLength",
  get: ({ get }) => {
    const elements = get(elementsState);

    return elements.length;
  },
});

export function TextPanel() {
  const setElements = useSetRecoilState(elementsState);
  const lastIndex = useRecoilValue(elementsLength);
  const setElementState = useSetRecoilState(elementState(lastIndex));

  function handleAddText(textElement: TextElementBase) {
    setElements((elements) => [...elements, elements.length]);
    setElementState(textElement);
  }
  return (
    <div className="py-8 flex flex-col space-y-4 text-center">
      <span
        className="cursor-pointer text-4xl font-bold"
        onClick={() => {
          handleAddText({
            ...defaultText,
            content: "Add a heading",
            font: { ...defaultText.font, size: 32 },
          });
        }}
      >
        Add a heading
      </span>
      <span className="divider" />
      <span
        className="cursor-pointer text-xl font-semibold"
        onClick={() => {
          handleAddText({
            ...defaultText,
            content: "Add a subheading",
            font: { ...defaultText.font, size: 26 },
          });
        }}
      >
        Add a subheading
      </span>
      <span className="divider" />
      <span
        className="cursor-pointer text font-semibold"
        onClick={() => {
          handleAddText({ ...defaultText, content: "Add a paragrah" });
        }}
      >
        Add a paragraph
      </span>
    </div>
  );
}

const defaultText: TextElementBase = {
  type: "textBase",
  left: 100,
  top: 100,
  rotation: 0,
  content: "Add some content",
  font: {
    size: 16,
    spacing: 1,
    height: 10,
    bold: true,
    color: "#000",
    italic: false,
    family: "Roboto",
    underline: false,
  },
};
