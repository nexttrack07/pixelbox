import { Canvas, Sidepanel, Toolbar, Sidebar } from "components";

export function Editor() {
  return (
    <div className="w-screen h-screen bg-base-100 flex flex-col">
      <div className="h-[65px] bg-base-200 border-b border-gray-500" />
      <div className="flex-1 flex">
        <div className="w-[65px] bg-base-300 border-r border-gray-500">
          <Sidebar />
        </div>
        <div className="relative w-[350px] bg-base-200 border-r border-gray-500">
          <Sidepanel />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-[65px] flex items-center justify-between border-b border-gray-500 w-full">
            <Toolbar />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Canvas />
          </div>
        </div>
      </div>
    </div>
  )
}
