import { Box } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { elementsState } from "stores/element.store";
import { Element } from "components"

export function Canvas() {
  const elements = useRecoilValue(elementsState);

  return (
    <Box position='relative' bg='white' h='550px' w='700px'>
      {elements.map(element => <Element key={element} id={element} />)}
    </Box>
  )
}