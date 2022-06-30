import { Box } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { elementsState, selectedElementIdsState} from "stores/element.store";
import { Element } from "components";

export function Canvas() {
  const elements = useRecoilValue(elementsState);
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);

  return (
    <Box
      position="relative"
      bg="white"
      h="550px"
      w="700px"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          setSelectedElement([]);
        }
      }}
    >
      {elements.map((element) => (
        <Element key={element} id={element} />
      ))}
    </Box>
  );
}
