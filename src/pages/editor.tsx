import {
  Box,
  Button,
  ButtonProps,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Grid,
  GridItem,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Canvas, Sidepanel, Toolbar, Sidebar } from "components";
import { CameraSelfie, ChevronDown } from "tabler-icons-react";

export function Editor() {
  return (
    <Grid
      templateAreas={`
        "header header header"
        "sidebar sidepanel toolbar"
        "sidebar sidepanel main" 
      `}
      gridTemplateRows="65px 65px 1fr"
      gridTemplateColumns="65px 300px 1fr"
      w="100vw"
      h="100vh"
      bg="gray.200"
    >
      <GridItem
        borderBottom="2px"
        borderColor="gray.400"
        bg="gray.200"
        area="header"
        display="flex"
        alignItems="center"
        gap={4}
        p={4}
      >
        <Image
          boxSize="40px"
          src="https://s2.svgbox.net/illlustrations.svg?ic=colortool"
        />
        <Menu>
          <MenuButton
            as={(props: ButtonProps) => (
              <Button
                {...props}
                ml={8}
                display="flex"
                alignItems="center"
                variant="unstyled"
              />
            )}
            rightIcon={<ChevronDown />}
          >
            Menu
          </MenuButton>
          <MenuList>
            <MenuItem>Save as template</MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Reset to default</MenuItem>
          </MenuList>
        </Menu>
        <Divider orientation="vertical" />
        <Editable defaultValue="Untitled design">
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Divider orientation="vertical" />
        <Text>1200px x 900px</Text>
        <Button
          ml={4}
          variant="outline"
          borderColor="gray.500"
          color="gray.600"
          size="sm"
        >
          Resize
        </Button>
        <Divider orientation="vertical" />
        <Button
          variant="outline"
          borderColor="gray.500"
          color="gray.600"
          size="sm"
        >
          Duplicate
        </Button>
        <Box flex={1} />
        <Button size="sm" shadow="md" colorScheme="blue">
          Upgrade now
        </Button>
      </GridItem>
      <GridItem
        borderRight="2px"
        borderColor="gray.400"
        bg="gray.300"
        area="sidebar"
      >
        <Sidebar />
      </GridItem>
      <GridItem
        p={4}
        borderRight="2px"
        borderColor="gray.400"
        bg="gray.200"
        area="sidepanel"
        position="relative"
      >
        <Sidepanel />
      </GridItem>
      <GridItem
        borderBottom="2px"
        borderColor="gray.400"
        bg="gray.200"
        area="toolbar"
      >
        <Toolbar />
      </GridItem>
      <GridItem
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.300"
        area="main"
      >
        <Canvas />
      </GridItem>
    </Grid>
  );
}
