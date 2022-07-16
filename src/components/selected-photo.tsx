import React from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { useRecoilState } from "recoil";
import { ImageElement, selectedElementState, Element } from "stores/element.store";
import { imgPreview } from "utils/image-preview";

function isPhotoElement(element?: Element): element is ImageElement {
  return (element as ImageElement).type === "image";
}

export function SelectedPhoto() {
  const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [circleCrop, setCircleCrop] = React.useState(false);
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();

  if (!isPhotoElement(selectedElement)) {
    return null;
  }

  const handleSwitchCrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCircleCrop(e.target.checked);
  };

  const handleSaveCrop = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      let url = await imgPreview(imgRef.current, completedCrop);
      setSelectedElement((el) => {
        console.log("..hialaskdf");
        if (el) {
          return {
            ...el,
            width: completedCrop.width,
            height: completedCrop.height,
            src: url,
            ...(circleCrop && { mask: "circle" }),
          };
        }
      });
    }
  };

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
      <label htmlFor="crop-modal" className="btn btn-primary btn-outline modal-button">
        Crop Image
      </label>

      <input type="checkbox" id="crop-modal" className="modal-toggle" />
      <label htmlFor="crop-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <ReactCrop
            crop={crop}
            aspect={circleCrop ? 1 : undefined}
            circularCrop={circleCrop}
            onComplete={(c) => setCompletedCrop(c)}
            onChange={(c) => setCrop(c)}
          >
            <img
              src={selectedElement.src}
              ref={imgRef}
              className={`w-[${selectedElement.width}px] h-[${selectedElement.height}px]`}
            />
          </ReactCrop>
          <div className="flex items-center justify-evenly">
            <label
              onClick={handleSaveCrop}
              htmlFor="crop-modal"
              className="btn btn-success btn-outline btn-sm"
            >
              Save
            </label>
            <label className="swap">
              <input checked={circleCrop} onChange={handleSwitchCrop} type="checkbox" />
              <div className="swap-on btn btn-sm btn-primary btn-outline">Circle</div>
              <div className="swap-off btn btn-sm btn-primary btn-outline">Rectangle</div>
            </label>
          </div>
        </label>
      </label>
    </div>
  );
}
