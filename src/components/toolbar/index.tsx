import { selectedBoxDimensions, selectedBoxPosition } from "components/select-handler";
import React from "react";
import {
  DefaultValue,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  elementState,
  elementsState,
  selectedElementIdsState,
  Element,
  selectedElementType,
} from "stores/element.store";
import {
  LayoutAlignBottom,
  LayoutAlignCenter,
  LayoutAlignLeft,
  LayoutAlignMiddle,
  LayoutAlignRight,
  LayoutAlignTop,
  LayoutDashboard,
  Trash,
} from "tabler-icons-react";
import { SvgToolbar } from "./svg-toolbar";
import { TextToolbar } from "./text-toolbar";

const selectedToolbarMap: Record<Element["type"], JSX.Element> = {
  rectangle: <div>Rectangle selected</div>,
  image: <div>Image selected</div>,
  svg: <SvgToolbar />,
  text: <TextToolbar />,
  textBase: <TextToolbar />,
};

const selectedBoxMid = selector({
  key: "selectedElementMid",
  get: ({ get }) => {
    const selectedPos = get(selectedBoxPosition);
    const selectedDims = get(selectedBoxDimensions);

    const { left, top } = selectedPos;
    const { width, height } = selectedDims;
    const bottom = top + height;
    const right = left + width;
    const hMid = (left + right) / 2;
    const vMid = (top + bottom) / 2;

    return { left, top, bottom, right, hMid, vMid };
  },
});

const selectedElementsSelector = selector({
  key: "selectedElementsSelector",
  get: ({ get }) => {
    const selectedElementIds = get(selectedElementIdsState);
    return selectedElementIds.map((id) => get(elementState(id)));
  },
  set: ({ get, set }, newElements) => {
    if (newElements instanceof DefaultValue) return;

    const selectedElementIds = get(selectedElementIdsState);
    selectedElementIds.forEach((id, i) => set(elementState(id), newElements[i]));
  },
});

export function Toolbar() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedElementIdsState);
  const setElementsState = useSetRecoilState(elementsState);
  const selectedElement = useRecoilValue(selectedElementType);
  const setSelectedElements = useSetRecoilState(selectedElementsSelector);
  const { left, top, bottom, right, hMid, vMid } = useRecoilValue(selectedBoxMid);

  function handleDeleteItems(e: React.MouseEvent) {
    e.stopPropagation();
    setElementsState((elements) => {
      return elements.filter((el) => !selectedItems.includes(el));
    });
    setSelectedItems([]);
  }

  const vertAlignActions = [
    {
      id: "align-top",
      icon: <LayoutAlignTop />,
      onClick: () => {
        setSelectedElements((elements) =>
          elements.map((el) => (el.top === top ? el : { ...el, top }))
        );
      },
    },
    {
      id: "align-center",
      icon: <LayoutAlignCenter />,
      onClick: () => {
        setSelectedElements((elements) =>
          elements.map((el) =>
            el.top + el.height / 2 === vMid ? el : { ...el, top: vMid - el.height / 2 }
          )
        );
      },
    },
    {
      id: "align-bottom",
      icon: <LayoutAlignBottom />,
      onClick: () => {
        setSelectedElements((elements) =>
          elements.map((el) =>
            el.top + el.height === bottom ? el : { ...el, top: bottom - el.height }
          )
        );
      },
    },
  ];

  const horAlignActions = [
    {
      id: "align-left",
      icon: <LayoutAlignLeft />,
      onClick: () => {
        setSelectedElements((elements) =>
          elements.map((el) => (el.left === left ? el : { ...el, left }))
        );
      },
    },
    {
      id: "align-middle",
      icon: <LayoutAlignMiddle />,
      onClick: () => {
        setSelectedElements((elements) =>
          elements.map((el) =>
            el.left + el.width / 2 === hMid ? el : { ...el, left: hMid - el.width / 2 }
          )
        );
      },
    },
    {
      id: "align-right",
      icon: <LayoutAlignRight />,
      onClick: () => {
        setSelectedElements((elements) =>
          elements.map((el) =>
            el.left + el.width === right ? el : { ...el, left: right - el.width }
          )
        );
      },
    },
  ];

  return (
    <div className="flex w-full items-center space-x-4 p-4">
      <div className="flex-1">
        {selectedElement && selectedToolbarMap[selectedElement]}
      </div>
      <div className="space-x-4 flex">
        <div className="dropdown dropdown-end">
          <button
            disabled={selectedItems.length < 2}
            tabIndex={0}
            className="btn btn-outline"
          >
            <LayoutDashboard />
          </button>
          <div
            tabIndex={0}
            className="dropdown-content card card-compact bg-slate-800 border border-slate-500 rounded mt-1"
          >
            <div className="card-body">
              <label className="label text-base">Vertical Align</label>
              <div className="flex space-x-2">
                {vertAlignActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className="btn btn-outline"
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
              <label className="label text-base">Horizontal Align</label>
              <div className="flex space-x-2">
                {horAlignActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className="btn btn-outline"
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button
          disabled={selectedItems.length === 0}
          onClick={handleDeleteItems}
          className="btn btn-outline"
          aria-label="trash icon"
        >
          <Trash />
        </button>
      </div>
    </div>
  );
}
