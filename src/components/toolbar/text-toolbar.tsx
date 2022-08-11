import { Dropdown } from "components/common/dropdown";
import { useRecoilState } from "recoil";
import { textSelector } from "stores/element.store";

const fonts = [
  "Roboto",
  "Helvetica",
  "Oswald",
  "Nunito",
  "Times New Roman",
  "Arial",
  "Comic sans",
];

export const TextToolbar = () => {
  const [fontProps, setFontProps] = useRecoilState(textSelector("font"));
  const [content] = useRecoilState(textSelector("content"));

  const handleSelectFont = (family: string) => {
    setFontProps({ ...fontProps, family });
  };
  return (
    <div className="flex items-center">
      <Dropdown
        renderFn={(val) => <span className="text-md">{val}</span>}
        onChange={handleSelectFont}
        value={fontProps?.family ?? ""}
        items={fonts}
      />
    </div>
  );
};
