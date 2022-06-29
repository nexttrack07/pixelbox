import { Grid, GridItem } from "@chakra-ui/react"
import { GraphicsPanel } from "components"

export function Editor() {

  return (
    <Grid
      templateAreas={`
        "header header header"
        "sidebar sidepanel toolbar"
        "sidebar sidepanel main" 
      `}
      gridTemplateRows='65px 65px 1fr'
      gridTemplateColumns='65px 300px 1fr'
      w='100vw'
      h='100vh'
      bg='gray.200'
    >
      <GridItem borderBottom='2px' borderColor='gray.400' bg='gray.200' area='header' />
      <GridItem borderRight='2px' borderColor='gray.400' bg='gray.300' area='sidebar' />
      <GridItem p={4} borderRight='2px' borderColor='gray.400' bg='gray.200' area='sidepanel'>
        <GraphicsPanel /> 
      </GridItem>
      <GridItem borderBottom='2px' borderColor='gray.400' bg='gray.200' area='toolbar' />
      <GridItem bg='gray.300' area='main' />
    </Grid>
  )
}
