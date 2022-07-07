import { Box, Fade, Heading, StackDivider, Text, VStack } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  defaultStyle,
  elementsState,
  elementState,
  ElementState,
  selectedElementType,
  TextState,
} from "stores/element.store";
import { GraphicsPanel } from "./graphics-panel";
import { SidebarItemState, sidebarState } from "./sidebar";

const sidepanelMap: Record<SidebarItemState, JSX.Element> = {
  templates: <div>Templates</div>,
  graphics: <GraphicsPanel />,
  photos: <div>Photos</div>,
  text: <TextPanel />,
};

const selectedPanelMap: Record<ElementState["type"], JSX.Element> = {
  rectangle: <div>Rectangle selected</div>,
  image: <div>Image selected</div>,
  svg: <div>Svg selected</div>,
  text: <div>Text selected</div>,
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

function TextPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const setElementState = useSetRecoilState(elementState(elements.length));

  function handleAddText({
    type = "text",
    color = "black",
    fontSize = 28,
    content = "Add text",
  }: Partial<TextState>) {
    setElements((elements) => [...elements, elements.length]);
    setElementState({
      type,
      color,
      fontSize,
      content,
      style: defaultStyle,
    });
  }
  return (
    <VStack spacing={6} divider={<StackDivider borderColor="gray.500" />} alignItems="center">
      <Heading
        sx={{ cursor: "pointer" }}
        onClick={() => {
          handleAddText({ fontSize: 32, content: "Add a heading" });
        }}
      >
        Add a heading
      </Heading>
      <Heading size="md">Add a subheading</Heading>
      <Text>Add a paragraph</Text>
    </VStack>
  );
}
