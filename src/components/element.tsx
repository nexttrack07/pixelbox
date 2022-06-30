import { Box } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { elementState } from "stores/element.store";

type ElementProps = {
  id: number;
}

export function Element({ id }: ElementProps) {
  const element = useRecoilValue(elementState(id))

  if (element.type === 'svg') {
    return <Box position='absolute' dangerouslySetInnerHTML={{ __html: element.html }} style={element.style} />
  }

  return (
    <Box position='absolute' style={element.style} />
  )
}