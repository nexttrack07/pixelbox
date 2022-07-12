import {
  VStack,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Text,
  HStack,
  Select,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  IconButton,
  Button,
  ButtonGroup,
  Flex,
  Box,
} from "@chakra-ui/react";
import { Bold, Italic, Strikethrough, Underline } from "tabler-icons-react";

const fonts = ["Roboto", "Helvetica", "Oswald", "Nunito", "Times New Roman", "Arial", "Comic sans"];

export function SelectedText() {
  return (
    <VStack p={4} alignItems="flex-start" spacing={8}>
      <Text fontWeight="semibold" fontSize="lg">
        Font
      </Text>
      <HStack>
        <Select borderColor="cyan.700" variant="outline">
          {fonts.map((font) => (
            <option style={{ fontFamily: font }} key={font} value={font}>
              {font}
            </option>
          ))}
        </Select>
        <Button borderColor="cyan.700" color="cyan.900" size="md" variant="outline">
          Add Font
        </Button>
      </HStack>
      <Flex w="100%" justifyContent="space-between" alignItems={"center"}>
        <ButtonGroup colorScheme="cyan" size="md" isAttached variant="outline">
          <IconButton aria-label="bold" icon={<Bold />} />
          <IconButton aria-label="italic" icon={<Italic />} />
          <IconButton aria-label="underline" icon={<Underline />} />
          <IconButton aria-label="strike" icon={<Strikethrough />} />
        </ButtonGroup>
        <NumberInput maxW={20} defaultValue={15} min={10} max={20}>
          <NumberInputField borderColor="cyan.700" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Box w="100%">
        <Text>Letter Spacing</Text>
        <Slider colorScheme="cyan" aria-label="letter spacing" defaultValue={30}>
          <SliderTrack bg="cyan.200">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <Box w="100%">
        <Text>Line Height</Text>
        <Slider colorScheme="cyan" aria-label="letter spacing" defaultValue={30}>
          <SliderTrack bg="cyan.200">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </VStack>
  );
}
