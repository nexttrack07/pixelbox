import React from "react";
import { selector, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedElementState, TextElement, Element } from "stores/element.store";
import { Bold, Italic, Underline } from "tabler-icons-react";
import { Dropdown } from "./common/dropdown";
import { Slider } from "./slider";

const fonts = [
  "Roboto",
  "Helvetica",
  "Oswald",
  "Nunito",
  "Times New Roman",
  "Arial",
  "Comic sans",
];

function isTextElement(element?: Element): element is TextElement {
  return (element as TextElement).content !== undefined;
}

const elementContentSelector = selector({
  key: "elementContent",
  get: ({ get }) => {
    const selectedElement = get(selectedElementState);

    if (isTextElement(selectedElement)) {
      return selectedElement.content;
    }

    return "";
  },
});
const fontProps = selector({
  key: "fontProps",
  get: ({ get }) => {
    const selectedElement = get(selectedElementState);

    if (isTextElement(selectedElement)) {
      return selectedElement.font;
    }

    return;
  },
});

export function SelectedText() {
  const setSelectedElement = useSetRecoilState(selectedElementState);
  const fontAttrs = useRecoilValue(fontProps);
  const elementContent = useRecoilValue(elementContentSelector);

  function handleChangeContent(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedElement((el) => {
      if (isTextElement(el)) {
        return {
          ...el,
          content: e.target.value,
        };
      }

      return el;
    });
  }

  function handleSelectedFont(family: string) {
    setSelectedElement((el) => {
      if (isTextElement(el) && family) {
        return {
          ...el,
          font: {
            ...el.font,
            family,
          },
        };
      }

      return el;
    });
  }

  function handleFontChange(val: number) {
    setSelectedElement((el) => {
      if (isTextElement(el)) {
        return {
          ...el,
          font: {
            ...el.font,
            size: val
          },
        };
      }

      return el;
    });
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      <span className="font-bold text-xl">Font</span>
      <Dropdown renderFn={(val) => <span className="text-md">{val}</span>} onChange={handleSelectedFont} value={fontAttrs?.family ?? ''} items={fonts} />
      <Slider onChange={handleFontChange} value={fontAttrs?.size || 20} label="Font Size" />
      <div className="flex items-center justify-between space-x-2">
        <div className="btn-group">
          <button onClick={() => {
            setSelectedElement((el) => {
              if (isTextElement(el)) {
                return {
                  ...el,
                  font: {
                    ...el.font,
                    bold: !el.font.bold
                  }
                }
              }
              return el;
            })
          }} className={`btn btn-outline ${fontAttrs?.bold && "btn-active"}`}>
            <Bold />
          </button>
          <button onClick={() => {
            setSelectedElement((el) => {
              if (isTextElement(el)) {
                return {
                  ...el,
                  font: {
                    ...el.font,
                    italic: !el.font.italic
                  }
                }
              }
              return el;
            })
          }} className={`btn btn-outline ${fontAttrs?.italic && "btn-active"}`}>
            <Italic />
          </button>
          <button onClick={() => {
            setSelectedElement((el) => {
              if (isTextElement(el)) {
                return {
                  ...el,
                  font: {
                    ...el.font,
                    underline: !el.font.underline
                  }
                }
              }
              return el;
            })
          }} className={`btn btn-outline ${fontAttrs?.underline && "btn-active"}`}>
            <Underline />
          </button>
        </div>
      </div>
      <input
        className="input input-primary"
        value={elementContent}
        onChange={handleChangeContent}
      />
    </div>
  );
}
