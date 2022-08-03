import { useRecoilValue } from "recoil";
import { Element, selectedElementType } from "stores/element.store";
import { GraphicsPanel } from "./graphics-panel";
import { PhotosPanel } from "./photos-panel";
import { SelectedPhoto } from "./selected-photo";
import { SelectedText } from "./selected-text";
import { SidebarItemState, sidebarState } from "./sidebar";
import { TextPanel } from "./text-panel";

const sidepanelMap: Record<SidebarItemState, JSX.Element> = {
  templates: <div>Templates</div>,
  graphics: <GraphicsPanel />,
  photos: <PhotosPanel />,
  text: <TextPanel />,
};

const selectedPanelMap: Record<Element["type"], JSX.Element> = {
  rectangle: <div>Rectangle selected</div>,
  image: <SelectedPhoto />,
  svg: <div>Svg selected</div>,
  text: <SelectedText />,
  textBase: <SelectedText />,
};

export function Sidepanel() {
  const sidebarValue = useRecoilValue(sidebarState);
  const selectedElement = useRecoilValue(selectedElementType);

  return (
    <>
      {sidepanelMap[sidebarValue]}
      {selectedElement && (
        <div
          className="bg-base-200 absolute top-0 bottom-0 right-0 left-0"
        >
          {selectedPanelMap[selectedElement]}
        </div>
      )}
    </>
  );
}
