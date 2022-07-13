import { SimpleGrid, Box, Image, Button } from "@chakra-ui/react";
import svgs from "data.json";
import { useRecoilState, useSetRecoilState } from "recoil";
import { elementsState, elementState } from "stores/element.store";

export function GraphicsPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const setElementState = useSetRecoilState(elementState(elements.length));

  function handleAddElement(url: string) {
    const newId = elements.length;
    setElements((elements) => [...elements, newId]);

    fetch(url)
      .then((res) => res.text())
      .then((html) => {
        setElementState({
          type: "svg",
          top: 100,
          left: 100,
          height: 100,
          width: 100,
          rotation: 0,
          html,
          src: url,
        });
      });
  }

  return (
    <>
      <SimpleGrid columns={3} spacing={4}>
        {svgs.data.map((item) => (
          <Button
            my={5}
            key={item.id}
            variant="unstyled"
            onClick={() => handleAddElement(item.url)}
          >
            <Image src={item.url} id={item.id} alt={item.id} boxSize="75px" />
          </Button>
        ))}
      </SimpleGrid>
    </>
  );
}
