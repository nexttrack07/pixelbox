import { Box, Fade, Heading, StackDivider, Text, VStack } from "@chakra-ui/react";
import { selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  defaultStyle,
  elementsState,
  elementState,
  ElementState,
  selectedElementType,
  TextElement,
  TextState,
} from "stores/element.store";
import { GraphicsPanel } from "./graphics-panel";
import { SelectedText } from "./selected-text";
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

const elementsLength = selector({
  key: "elementsLength",
  get: ({ get }) => {
    const elements = get(elementsState);

    return elements.length;
  },
});

function TextPanel() {
  const setElements = useSetRecoilState(elementsState);
  const lastIndex = useRecoilValue(elementsLength);
  const setElementState = useSetRecoilState(elementState(lastIndex));

  function handleAddText(textElement: TextElement) {
    setElements((elements) => [...elements, elements.length]);
    setElementState(textElement);
  }
  return (
    <VStack spacing={6} divider={<StackDivider borderColor="gray.500" />} alignItems="center">
      <Heading
        sx={{ cursor: "pointer" }}
        onClick={() => {
          handleAddText({
            ...defaultText,
            content: "Add a heading",
            font: { ...defaultText.font, size: 32 },
          });
        }}
      >
        Add a heading
      </Heading>
      <Heading
        sx={{ cursor: "pointer" }}
        onClick={() => {
          handleAddText({
            ...defaultText,
            content: "Add a subheading",
            font: { ...defaultText.font, size: 26 },
          });
        }}
        size="md"
      >
        Add a subheading
      </Heading>
      <Text
        sx={{ cursor: "pointer" }}
        onClick={() => {
          handleAddText({ ...defaultText, content: "Add a paragrah" });
        }}
      >
        Add a paragraph
      </Text>
    </VStack>
  );
}

const defaultText: TextElement = {
  type: "text",
  left: 100,
  top: 100,
  rotation: 0,
  content: "Add some content",
  font: {
    size: 16,
    spacing: 1,
    height: 10,
    style: "normal",
    family: "Roboto",
  },
};
