import { ChangeEvent } from "react";

type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}

export function Slider({ label, onChange, value, min = 0, max = 100, step = 1 }: Props) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(parseInt(e.target.value))
  }

  return (
    <div className="py-1">
      <div className="flex items-center justify-between">
        <label className="label">{label}</label>
        <span>{value}</span>
      </div>
      <input onChange={handleChange} className="range range-primary range-sm" type="range" value={value} min={min} max={max} step={step} />
    </div>
  )
}