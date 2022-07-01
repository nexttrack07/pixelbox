import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { Center, IconButton, Stack, StackDivider } from "@chakra-ui/react";
import {
  ChartInfographic,
  Photo,
  Template,
  TextResize,
} from "tabler-icons-react";

const sidebarItems = [
  { id: "templates", icon: <Template /> },
  { id: "photos", icon: <Photo /> },
  { id: "text", icon: <TextResize /> },
  { id: "graphics", icon: <ChartInfographic /> },
] as const;

export type SidebarItemState = typeof sidebarItems[number]["id"];

export const sidebarState = atom<SidebarItemState>({
  key: "sidebarState",
  default: "graphics",
});

export function Sidebar() {
  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  return (
    <Stack spacing={0} direction="column">
      {sidebarItems.map((item) => (
        <Center
          backgroundColor={sidebar === item.id ? "gray.200" : "gray.300"}
          p={6}
          key={item.id}
          borderBottom="1px solid"
          borderColor="gray.600"
        >
          <IconButton
            variant="unstyled"
            color="gray.600"
            size="xs"
            aria-label={item.id}
            icon={item.icon}
            onClick={() => setSidebar(item.id)}
          />
        </Center>
      ))}
    </Stack>
  );
}
