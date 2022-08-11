import React from "react";

type Props = {
  value: number;
  onChange: (n: number) => void;
}

export const NumberInput = ({ value, onChange }: Props) => {
  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (typeof parseInt(e.target.value) === "number") {
      onChange(parseInt(e.target.value));
    }
  }

  const handleIncDec = (val: number) => {
    onChange(val);
  }
  return (
    <div className="flex">
      <button onClick={() => handleIncDec(value - 1)} className="btn rounded">-</button>
      <input value={value} className="input input-bordered w-20 rounded-none" onChange={handleNumberChange} />
      <button onClick={() => handleIncDec(value + 1)} className="btn rounded">+</button>
    </div>
  )
}