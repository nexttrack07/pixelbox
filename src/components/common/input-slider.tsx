import React from "react";

type Props = {
  label: string;
  value: string | number;
  onChange: (val: string | number) => void;
};

export function InputSlider({ value, label, onChange }: Props) {
  const handleRangeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-2 my-4">
      <div className="flex items-center justify-between">
        <label className="label text-base">{label}</label>
        <input
          onChange={handleInputChange}
          value={value}
          className="input input-bordered input-sm w-16"
        />
      </div>
      <input
        onChange={handleRangeChange}
        value={value}
        type="range"
        className="range range-sm"
      />
    </div>
  );
}
