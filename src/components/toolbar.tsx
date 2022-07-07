import { Box, Button, Divider, Flex, IconButton, Stack, StackDivider } from "@chakra-ui/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { canvasState, elementsState, selectedElementIdsState } from "stores/element.store";
import {
  ArrowBarToDown,
  ArrowBarToUp,
  FileArrowLeft,
  FileArrowRight,
  FileDatabase,
  GridDots,
  LayersSubtract,
  Template,
  Trash,
} from "tabler-icons-react";

export function Toolbar() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedElementIdsState);
  const setElementsState = useSetRecoilState(elementsState);
  // const [canvas, setCanvas] = useRecoilState(canvasState);

  // console.log("canvas ", canvas);

  function handleDeleteItems() {
    setElementsState((elements) => elements.filter((el) => !selectedItems.includes(el)));
    setSelectedItems([]);
  }

  // function handleSaveTemplate() {
  //   localStorage.setItem("random_canvas", JSON.stringify(canvas));
  // }

  // function handleGetTemplate() {
  //   const jsonCanvasItem = localStorage.getItem("random_canvas");

  //   if (jsonCanvasItem) {
  //     setCanvas(JSON.parse(jsonCanvasItem));
  //   }
  // }

  return (
    <Flex alignItems="center" p={2}>
      <Stack divider={<StackDivider borderColor="gray.400" />} direction="row">
        <IconButton aria-label="go back" disabled variant="outline" icon={<FileArrowLeft />} />
        <IconButton aria-label="go forward" disabled variant="outline" icon={<FileArrowRight />} />
        <IconButton
          aria-label="duplicate layer"
          disabled
          variant="outline"
          icon={<LayersSubtract />}
        />
        <IconButton aria-label="Forward" disabled variant="outline" icon={<ArrowBarToUp />} />
        <IconButton aria-label="Backward" disabled variant="outline" icon={<ArrowBarToDown />} />
        <IconButton aria-label="Grid" disabled variant="outline" icon={<GridDots />} />
        <IconButton
          disabled={selectedItems.length === 0}
          onClick={handleDeleteItems}
          variant="outline"
          aria-label="trash icon"
          icon={<Trash />}
        />
      </Stack>
      <Box flex={1} />
      <Stack direction="row" divider={<StackDivider borderColor="gray.400" />}>
        <Button
          // onClick={handleGetTemplate}
          size="xs"
          leftIcon={<Template />}
          color="gray.500"
          variant="ghost"
        >
          Get Template
        </Button>
        <Button
          // onClick={handleSaveTemplate}
          size="xs"
          variant="ghost"
          leftIcon={<FileDatabase />}
          color="gray.500"
        >
          Save Template
        </Button>
      </Stack>
    </Flex>
  );
}
