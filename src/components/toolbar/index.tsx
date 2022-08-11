import React from "react";
import { DefaultValue, selector, selectorFamily, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { elementState, elementsState, selectedElementIdsState, Element, selectedElementType, BaseElement } from "stores/element.store";
import { LayoutAlignBottom, LayoutAlignCenter, LayoutAlignLeft, LayoutAlignMiddle, LayoutAlignRight, LayoutAlignTop, LayoutDashboard, Trash } from "tabler-icons-react";
import { SvgToolbar } from "./svg-toolbar";
import { TextToolbar } from "./text-toolbar";

const selectedToolbarMap: Record<Element["type"], JSX.Element> = {
  rectangle: <div>Rectangle selected</div>,
  image: <div>Image selected</div>,
  svg: <SvgToolbar />,
  text: <TextToolbar />,
  textBase: <TextToolbar />,
}

const selectedElementsState = selectorFamily<any, keyof BaseElement>({
  key: "selectedElements",
  get: prop => ({ get }) => {
    const selectedElementIds = get(selectedElementIdsState);
    return selectedElementIds.map(id => get(elementState(id))[prop])
  },
  set: (prop) => ({ set, get }, val) => {
    if (val instanceof DefaultValue) return;
    const selectedElementIds = get(selectedElementIdsState);
    const selectedElements = selectedElementIds.map(id => elementState(id));

    selectedElements.forEach(elAtom => {
      set(elAtom, el => ({
        ...el,
        [prop]: val
      }))
    })
  }
})

const selectedElementsPosition = selector({
  key: "selectedElementsPosition",
  get: () => { },
  set: ({ set, get }, val) => {
    if (val instanceof DefaultValue) return;
    const selectedElementIds = get(selectedElementIdsState);
    if (selectedElementIds.length === 0) return;
    const selectedElements = selectedElementIds.map(id => get(elementState(id)));
    const newLeft = selectedElements.reduce((prev, el) => prev + el.left, 0) / selectedElementIds.length;

    selectedElementIds.forEach(id => {
      set(elementState(id), (el) => ({
        ...el,
        left: newLeft
      }))
    })
  }
})

export function Toolbar() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedElementIdsState);
  const setElementsState = useSetRecoilState(elementsState);
  const selectedElement = useRecoilValue(selectedElementType);
  const setSelectedPosition = useSetRecoilState(selectedElementsPosition);
  const [selectedLeft, setSelectedLeft] = useRecoilState(selectedElementsState("left"));
  const [selectedTop, setSelectedTop] = useRecoilState(selectedElementsState("top"));

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
        if (!selectedTop.length) return;
        console.log('selected top: ', selectedTop)
        const newTop = Math.min(...selectedTop)
        console.log("new: ", newTop)
        setSelectedTop(newTop);
      }
    },
    {
      id: "align-center",
      icon: <LayoutAlignCenter />,
      onClick: () => {
        if (!selectedTop.length) return;
        console.log('selected top: ', selectedTop)
        const newTop = selectedTop.reduce((sum, val) => sum + val, 0) / selectedTop.length;
        console.log("new: ", newTop)
        setSelectedTop(newTop);
      }
    },
    {
      id: "align-bottom",
      icon: <LayoutAlignBottom />,
      onClick: () => {
        if (!selectedTop.length) return;
        console.log('selected top: ', selectedTop)
        const newTop = Math.max(...selectedTop)
        console.log("new: ", newTop)
        setSelectedTop(newTop);
      }
    },
  ]

  const horAlignActions = [
    {
      id: "align-left",
      icon: <LayoutAlignLeft />,
      onClick: () => {
        if (!selectedLeft.length) return;
        console.log('selected left: ', selectedLeft)
        const newLeft = Math.min(...selectedLeft)
        console.log("new: ", newLeft)
        setSelectedLeft(newLeft);
      }
    },
    {
      id: "align-middle",
      icon: <LayoutAlignMiddle />,
      onClick: () => {
        if (!selectedLeft.length) return;
        const newLeft = selectedLeft.reduce((sum, val) => sum + val, 0) / selectedLeft.length;
        setSelectedLeft(newLeft);
      }
    },
    {
      id: "align-right",
      icon: <LayoutAlignRight />,
      onClick: () => {
        if (!selectedLeft.length) return;
        const newLeft = Math.max(...selectedLeft)
        setSelectedLeft(newLeft);
      }
    },
  ]

  return (
    <div className="flex w-full items-center space-x-4 p-4">
      <div className="flex-1">
        {selectedElement && selectedToolbarMap[selectedElement]}
      </div>
      <div className="space-x-4 flex">
        <div className="dropdown dropdown-end">
          <button disabled={selectedItems.length < 2} tabIndex={0} className="btn btn-outline">
            <LayoutDashboard />
          </button>
          <div tabIndex={0} className="dropdown-content card card-compact bg-slate-800 border border-slate-500 rounded mt-1">
            <div className="card-body">
              <label className="label text-base">Vertical Align</label>
              <div className="flex space-x-2">
                {vertAlignActions.map(action => (
                  <button key={action.id} onClick={action.onClick} className="btn btn-outline">
                    {action.icon}
                  </button>
                ))}
              </div>
              <label className="label text-base">Horizontal Align</label>
              <div className="flex space-x-2">
                {horAlignActions.map(action => (
                  <button key={action.id} onClick={action.onClick} className="btn btn-outline">
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
