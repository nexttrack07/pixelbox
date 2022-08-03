import { atom, useRecoilState } from "recoil";
import { ChartInfographic, Photo, Template, TextResize } from "tabler-icons-react";

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
    <div className="flex flex-col">
      {sidebarItems.map((item) => (
        <div
          className={`p-6 flex items-center justify-center hover:bg-blue-900 border-b border-gray-600  ${sidebar === item.id ? "bg-base-200" : "bg-base-300"}`}
          key={item.id}
        >
          <button
            className="text-blue-100 btn-xs"
            aria-label={item.id}
            onClick={() => setSidebar(item.id)}
          >
            {item.icon}
          </button>
        </div>
      ))}
    </div>
  );
}
