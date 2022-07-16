import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import React, { Fragment } from "react";
import { selector, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedElementState, TextElement, Element } from "stores/element.store";
import { Bold, Italic, Strikethrough, Underline } from "tabler-icons-react";

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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

  return (
    <div className="flex flex-col space-y-4 p-4">
      <span className="font-bold text-xl">Font</span>
      <div className="flex items-center space-x-2 justify-between">
        <Listbox value={fontAttrs?.family} onChange={handleSelectedFont}>
          {({ open }) => (
            <>
              <div className="relative w-full">
                <Listbox.Button className="btn btn-sm w-full btn-outline">
                  <span className="block truncate">{fontAttrs?.family}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {fonts.map((font) => (
                      <Listbox.Option
                        key={font}
                        className={({ active }) =>
                          classNames(
                            active ? "text-white bg-indigo-600" : "text-gray-900",
                            "cursor-default select-none relative py-2 pl-3 pr-9"
                          )
                        }
                        value={font}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {font}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-indigo-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
        <button className="btn btn-outline btn-sm w-18 text-xs">Add Font</button>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="btn-group">
          <button className="btn btn-xs btn-outline">
            <Bold />
          </button>
          <button className="btn btn-xs btn-outline">
            <Italic />
          </button>
          <button className="btn btn-xs btn-outline">
            <Underline />
          </button>
          <button className="btn btn-xs btn-outline">
            <Strikethrough />
          </button>
        </div>
        <input
          className="input input-xs bg-transparent border border-gray-700 input-bordered w-12"
          type="number"
          onChange={(e) => {
            setSelectedElement((el) => {
              if (isTextElement(el)) {
                return {
                  ...el,
                  font: {
                    ...el.font,
                    size: parseInt(e.target.value),
                  },
                };
              }
              return el;
            });
          }}
          defaultValue={fontAttrs?.size}
        />
      </div>
      <div className="w-full">
        <span className="font-semibold text-sm">Letter Spacing</span>
        <input type="range" min="0" max="100" className="range range-accent range-xs" />
      </div>
      <div className="w-full">
        <span className="font-semibold text-sm">Line Height</span>
        <input type="range" min="0" max="100" className="range range-accent range-xs" />
      </div>
      <input
        className="input input-primary"
        value={elementContent}
        onChange={handleChangeContent}
      />
    </div>
  );
}
