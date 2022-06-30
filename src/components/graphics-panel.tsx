import { SimpleGrid, Box, Image, Button } from "@chakra-ui/react";
import svgs from 'data.json';
import { useRecoilState, useSetRecoilState } from "recoil";
import { defaultStyle, elementsState, elementState } from "stores/element.store";

export function GraphicsPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const setElementState = useSetRecoilState(elementState(elements.length));

  function handleAddElement(url: string) {
    const newId = elements.length;
    setElements(elements => [...elements, newId]);

    fetch(url)
      .then(res => res.text())
      .then(html => {
        setElementState({
          type: 'svg',
          style: defaultStyle,
          html
        })

      })
  }

  return (
    <>
    <SimpleGrid columns={3} spacing={4}>
      {svgs.data.map(item => (
        <Button key={item.id} variant='unstyled' onClick={() => handleAddElement(item.url)}>
          <Image 
            src={item.url}
            id={item.id}
            alt={item.id} 
            boxSize='75px'
          />
         </Button>
      ))}
    </SimpleGrid>
    </>
  )
}