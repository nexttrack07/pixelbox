import { Box, Fade } from "@chakra-ui/react";
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
};

export function Sidepanel() {
  const sidebarValue = useRecoilValue(sidebarState);
  const selectedElement = useRecoilValue(selectedElementType);

  return (
    <>
      {sidepanelMap[sidebarValue]}
      {selectedElement && (
        <Fade in={true}>
          <Box
            backgroundColor="gray.200"
            position="absolute"
            sx={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {selectedPanelMap[selectedElement]}
          </Box>
        </Fade>
      )}
    </>
  );
}
