import { useRecoilValue } from "recoil";
import { GraphicsPanel } from "./graphics-panel";
import { SidebarItemState, sidebarState } from "./sidebar";

const sidepanelMap: Record<SidebarItemState, JSX.Element> = {
  templates: <div>Templates</div>,
  graphics: <GraphicsPanel />,
  photos: <div>Photos</div>,
  text: <div>Text</div>,
};

export function Sidepanel() {
  const sidebarValue = useRecoilValue(sidebarState);

  return sidepanelMap[sidebarValue];
}
