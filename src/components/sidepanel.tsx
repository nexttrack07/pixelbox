import { useRecoilValue } from "recoil";
import { GraphicsPanel } from "./graphics-panel";
import { PhotosPanel } from "./photos-panel";
import { SidebarItemState, sidebarState } from "./sidebar";
import { TextPanel } from "./text-panel";

const sidepanelMap: Record<SidebarItemState, JSX.Element> = {
  templates: <div>Templates</div>,
  graphics: <GraphicsPanel />,
  photos: <PhotosPanel />,
  text: <TextPanel />,
};

export function Sidepanel() {
  const sidebarValue = useRecoilValue(sidebarState);

  return (
    <>
      {sidepanelMap[sidebarValue]}
    </>
  );
}
