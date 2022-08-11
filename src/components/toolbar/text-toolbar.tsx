import { Dropdown } from "components/common/dropdown";
import { NumberInput } from "components/common/number-input";
import { ColorResult, TwitterPicker } from "react-color";
import { useRecoilState } from "recoil";
import { textSelector } from "stores/element.store";
import { Bold, Italic, Palette, Underline } from "tabler-icons-react";

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

  const handleChangeFontSize = (size: number) => {
    setFontProps({ ...fontProps, size });
  };

  const handleColorChange = ({ hex }: ColorResult) => {
    setFontProps({ ...fontProps, color: hex });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="w-48">
        <Dropdown
          renderFn={(val) => <span className="text-md">{val}</span>}
          onChange={handleSelectFont}
          value={fontProps?.family ?? ""}
          items={fonts}
        />
      </div>
      <NumberInput value={fontProps.size} onChange={handleChangeFontSize} />
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-outline">
          <Palette />
        </label>
        <div tabIndex={0} className="dropdown-content mt-4">
          <TwitterPicker onChangeComplete={handleColorChange} color={fontProps.color} />
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => setFontProps({ ...fontProps, bold: !fontProps.bold })}
          className="rounded-tl rounded-bl border p-[10px] border-primary">
          <Bold color={fontProps.bold ? "#60a5fa" : "#bfdbfe"} />
        </button>
        <button
          onClick={() => setFontProps({ ...fontProps, italic: !fontProps.italic })}
          className="border-l-0 border-r-0 border p-[10px] border-primary">
          <Italic color={fontProps.italic ? "#60a5fa" : "#bfdbfe"} />
        </button>
        <button
          onClick={() => setFontProps({ ...fontProps, underline: !fontProps.underline })}
          className="rounded-tr rounded-br border p-[10px] border-primary"
        >
          <Underline color={fontProps.underline ? "#60a5fa" : "#bfdbfe"} />
        </button>
      </div>
    </div>
  );
};
