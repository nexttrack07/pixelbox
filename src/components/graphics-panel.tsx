import svgs from "data.json";
import { useRecoilState, useSetRecoilState } from "recoil";
import { elementsState, elementState } from "stores/element.store";

export function GraphicsPanel() {
  const [elements, setElements] = useRecoilState(elementsState);
  const setElementState = useSetRecoilState(elementState(elements.length));

  function handleAddElement(url: string) {
    const newId = elements.length;
    setElements((elements) => [...elements, newId]);

    fetch(url)
      .then((res) => res.text())
      .then((html) => {
        setElementState({
          type: "svg",
          top: 100,
          left: 100,
          height: 100,
          width: 100,
          rotation: 0,
          html,
          src: url,
        });
      });
  }

  return (
    <>
      <div className="flex space-x-2 space-y-2 flex-wrap p-4 justify-center">
        {svgs.data.map((item) => (
          <button
            className="my-5 w-[75px]"
            key={item.id}
            onClick={() => handleAddElement(item.url)}
          >
            <img src={item.url} id={item.id} alt={item.id} />
          </button>
        ))}
      </div>
    </>
  );
}
