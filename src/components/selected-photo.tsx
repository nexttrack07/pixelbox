import { useDebounceEffect } from "hooks/use-debounce";
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
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();

  if (!isPhotoElement(selectedElement)) {
    return null;
  }

  useDebounceEffect(
    async () => {
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
            };
          }
        });
      }
    },
    100,
    [completedCrop]
  );

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
      <label htmlFor="my-modal-4" className="btn bg-slate-800 modal-button">
        Crop Image
      </label>

      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <ReactCrop
            crop={crop}
            circularCrop={true}
            onComplete={(c) => setCompletedCrop(c)}
            onChange={(c) => setCrop(c)}
          >
            <img
              src={selectedElement.src}
              ref={imgRef}
              className={`w-[${selectedElement.width}px] h-[${selectedElement.height}px]`}
            />
          </ReactCrop>
        </label>
      </label>
    </div>
  );
}
