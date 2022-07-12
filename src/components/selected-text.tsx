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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SliderFilledTrack,
  IconButton,
  Button,
  ButtonGroup,
  Flex,
  Box,
} from "@chakra-ui/react";
import { selector, useRecoilValue, useSetRecoilState } from "recoil";
import { selectedElementState, TextElement, Element } from "stores/element.store";
import { Bold, Italic, Strikethrough, Underline, ChevronDown } from "tabler-icons-react";

const fonts = ["Roboto", "Helvetica", "Oswald", "Nunito", "Times New Roman", "Arial", "Comic sans"];

function isTextElement(element?: Element): element is TextElement {
  return (element as TextElement).content !== undefined;
}

const fontProps = selector({
  key: "fontProps",
  get: ({ get }) => {
    const selectedElement = get(selectedElementState);

    if (isTextElement(selectedElement)) {
      return selectedElement.font;
    }

    return;
  },
});

export function SelectedText() {
  const setSelected = useSetRecoilState(selectedElementState);
  const fontAttrs = useRecoilValue(fontProps);
  return (
    <VStack p={4} alignItems="flex-start" spacing={8}>
      <Text fontWeight="semibold" fontSize="lg">
        Font
      </Text>
      <HStack w="100%">
        <Menu>
          <MenuButton
            variant="outline"
            w="100%"
            borderColor="cyan.800"
            color="cyan.900"
            as={Button}
            rightIcon={<ChevronDown />}
          >
            {fontAttrs?.family}
          </MenuButton>
          <MenuList>
            {fonts.map((font) => (
              <MenuItem
                onClick={() => {
                  setSelected((el) => {
                    if (isTextElement(el)) {
                      return {
                        ...el,
                        font: {
                          ...el.font,
                          family: font,
                        },
                      };
                    }

                    return el;
                  });
                }}
                style={{ fontFamily: font }}
                key={font}
                value={font}
              >
                {font}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
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
        <NumberInput
          onChange={(val) => {
            setSelected((el) => {
              if (isTextElement(el)) {
                return {
                  ...el,
                  font: {
                    ...el.font,
                    size: parseInt(val),
                  },
                };
              }
              return el;
            });
          }}
          maxW={20}
          defaultValue={fontAttrs?.size}
        >
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
