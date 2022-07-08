import { Box, Fade, Heading, StackDivider, Text, VStack } from "@chakra-ui/react";
import { selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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

  function handleAddText(textElement: TextState) {
    setElements((elements) => [...elements, elements.length]);
    setElementState({
      ...textElement,
      style: defaultStyle,
    });
  }
  return (
    <VStack spacing={6} divider={<StackDivider borderColor="gray.500" />} alignItems="center">
      <Heading
        sx={{ cursor: "pointer" }}
        onClick={() => {
          handleAddText(HeadingText);
        }}
      >
        Add a heading
      </Heading>
      <Heading
        sx={{ cursor: "pointer" }}
        onClick={() => {
          handleAddText(SubHeadingText);
        }}
        size="md"
      >
        Add a subheading
      </Heading>
      <Text
        sx={{ cursor: "pointer" }}
        onClick={() => {
          handleAddText(ParagraphText);
        }}
      >
        Add a paragraph
      </Text>
    </VStack>
  );
}

const TextCommon: Pick<TextState, "color" | "type"> = {
  color: "black",
  type: "text",
};

const HeadingText: TextState = {
  fontSize: 28,
  content: "Add a heading",
  ...TextCommon,
};

const SubHeadingText: TextState = {
  fontSize: 20,
  content: "Add a subheading",
  ...TextCommon,
};

const ParagraphText: TextState = {
  fontSize: 16,
  content: "Add a paragraph",
  ...TextCommon,
};
