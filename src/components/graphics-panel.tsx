import { SimpleGrid, Box, Image, Button } from "@chakra-ui/react";
import svgs from 'data.json';
import { useState } from "react";

export function GraphicsPanel() {
  const [currentSvg, setCurrentSvg] = useState<string|null>(null)

  function handleLoadSvg(url: string) {
    fetch(url)
      .then(res => res.text())
      .then(data => {
        setCurrentSvg(data);
      })
  }

  return (
    <>
    <SimpleGrid columns={3} spacing={4}>
      {svgs.data.map(item => (
        <Button variant='unstyled' onClick={() => handleLoadSvg(item.url)}>
          <Image 
            src={item.url}
            id={item.id}
            alt={item.id} 
            boxSize='75px'
          />
         </Button>
      ))}
    </SimpleGrid>
    <br />
    {currentSvg && (
      <Box 
        dangerouslySetInnerHTML={{ __html: currentSvg }}
      />
    )}
    </>
  )
}