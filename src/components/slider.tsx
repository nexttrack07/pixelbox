type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
}
export function Slider({ label, value, min = 0, max = 100, step = 1 }: Props) {
  return (
    <div className="py-1">
      <div className="flex items-center justify-between">
        <label className="label">{label}</label>
        <span>{value}</span>
      </div>
      <input className="range range-primary range-sm" type="range" value={value} min={min} max={max} step={step} />
    </div>
  )
}