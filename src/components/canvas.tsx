import { Box } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { elementsState, selectedElementIdsState } from "stores/element.store";
import { Element } from "components";
import { Suspense } from "react";

export function Canvas() {
  const elements = useRecoilValue(elementsState);
  const setSelectedElement = useSetRecoilState(selectedElementIdsState);

  return (
    <Box
      position="relative"
      bg="white"
      h="750px"
      w="900px"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          setSelectedElement([]);
        }
      }}
    >
      {elements.map((element) => (
        <Suspense key={element} fallback={<div>Loading...</div>}>
          <Element id={element} />
        </Suspense>
      ))}
    </Box>
  );
}
