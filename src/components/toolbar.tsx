import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { elementsState, selectedElementIdsState } from "stores/element.store";
import { Trash } from "tabler-icons-react";

export function Toolbar() {
  const [selectedItems, setSelectedItems] = useRecoilState(selectedElementIdsState);
  const setElementsState = useSetRecoilState(elementsState)

  function handleDeleteItems() {
    setElementsState(elements => elements.filter(el => !selectedItems.includes(el)));
    setSelectedItems([])
  }

  return (
    <Flex p={2} alignItems='center'>
      <Box flex={1} />
      <IconButton disabled={selectedItems.length === 0} onClick={handleDeleteItems} variant='outline' aria-label="trash icon" icon={<Trash />} />      
    </Flex>
  )
}