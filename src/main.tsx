import React from "react";
import ReactDOM from "react-dom/client";
import "react-image-crop/dist/ReactCrop.css";
import "./index.css";
import { RecoilRoot } from "recoil";

import { Editor } from "pages";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Editor />
    </RecoilRoot>
  </React.StrictMode>
);
