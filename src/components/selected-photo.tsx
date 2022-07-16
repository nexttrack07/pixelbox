import { useRecoilState } from "recoil";
import { ImageElement, selectedElementState, Element } from "stores/element.store";

function isPhotoElement(element?: Element): element is ImageElement {
  return (element as ImageElement).type === "image";
}

export function SelectedPhoto() {
  const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState);

  return (
    <div className="flex flex-col space-y-4 p-4">
      <span className="font-bold text-lg">Position</span>
      <div className="flex items-center justify-between">
        <div className="form-control">
          <label className="input-group">
            <span className="bg-slate-800 text-slate-100">L</span>
            <input
              type="number"
              className="input input-bordered w-16"
              value={selectedElement?.left}
              onChange={(e) => {
                setSelectedElement((el) => {
                  if (el) {
                    return {
                      ...el,
                      left: parseInt(e.target.value),
                    };
                  }
                });
              }}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="input-group">
            <span className="bg-slate-800 text-slate-100">T</span>
            <input
              value={selectedElement?.top}
              onChange={(e) => {
                setSelectedElement((el) => {
                  if (el) {
                    return {
                      ...el,
                      top: parseInt(e.target.value),
                    };
                  }
                });
              }}
              type="number"
              className="input input-bordered w-16"
            />
          </label>
        </div>
      </div>
      {isPhotoElement(selectedElement) && (
        <div className="flex items-center justify-between">
          <div className="form-control">
            <label className="input-group">
              <span className="bg-slate-800 text-slate-100">W</span>
              <input
                value={selectedElement.width.toFixed(0)}
                onChange={(e) => {
                  setSelectedElement((el) => {
                    if (el) {
                      return {
                        ...el,
                        width: parseInt(e.target.value),
                      };
                    }
                  });
                }}
                type="number"
                className="input input-bordered w-16"
              />
            </label>
          </div>
          <div className="form-control">
            <label className="input-group">
              <span className="bg-slate-800 text-slate-100">H</span>
              <input
                value={selectedElement.height.toFixed(0)}
                onChange={(e) => {
                  setSelectedElement((el) => {
                    if (el) {
                      return {
                        ...el,
                        height: parseInt(e.target.value),
                      };
                    }
                  });
                }}
                type="number"
                className="input input-bordered w-16"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
