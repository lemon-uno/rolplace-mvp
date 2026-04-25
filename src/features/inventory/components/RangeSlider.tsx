'use client'

import { useCallback, useRef, useEffect, useState } from 'react'

interface RangeSliderProps {
  min: number
  max: number
  step: number
  value: { min?: number; max?: number }
  onChange: (value: { min: number; max: number }) => void
  formatLabel?: (value: number) => string
  label: string
}

export function RangeSlider({ min, max, step, value, onChange, formatLabel, label }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null)
  const minVal = value.min ?? min
  const maxVal = value.max ?? max
  const fmt = formatLabel ?? ((v: number) => v.toLocaleString('es-MX'))

  const pct = (val: number) => ((val - min) / (max - min)) * 100

  const getValueFromX = useCallback((clientX: number) => {
    if (!trackRef.current) return 0
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const raw = min + ratio * (max - min)
    return Math.round(raw / step) * step
  }, [min, max, step])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragging) return
    const val = getValueFromX(e.clientX)
    if (dragging === 'min') {
      onChange({ min: Math.min(val, maxVal - step), max: maxVal })
    } else {
      onChange({ min: minVal, max: Math.max(val, minVal + step) })
    }
  }, [dragging, getValueFromX, minVal, maxVal, step, onChange])

  const handlePointerUp = useCallback(() => {
    setDragging(null)
  }, [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, [dragging, handlePointerMove, handlePointerUp])

  return (
    <div>
      <label className="block text-xs font-medium text-[#9ca3af] mb-2">{label}</label>
      <div className="flex justify-between text-xs text-[#9ca3af] mb-1">
        <span>{fmt(minVal)}</span>
        <span>{fmt(maxVal)}</span>
      </div>
      <div ref={trackRef} className="relative h-[3px] rounded-full bg-[#9ca3af] cursor-pointer select-none">
        {/* Active range */}
        <div
          className="absolute h-full rounded-full bg-[#215add]"
          style={{ left: `${pct(minVal)}%`, width: `${pct(maxVal) - pct(minVal)}%` }}
        />
        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#215add] shadow-lg border-2 border-[#215add] cursor-grab active:cursor-grabbing z-10 flex items-center justify-center hover:scale-110 transition-transform"
          style={{ left: `calc(${pct(minVal)}% - 8px)` }}
          onPointerDown={(e) => { e.preventDefault(); setDragging('min') }}
        >
          <div className="w-0.5 h-2 bg-white rounded-full" />
        </div>
        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#215add] shadow-lg border-2 border-[#215add] cursor-grab active:cursor-grabbing z-10 flex items-center justify-center hover:scale-110 transition-transform"
          style={{ left: `calc(${pct(maxVal)}% - 8px)` }}
          onPointerDown={(e) => { e.preventDefault(); setDragging('max') }}
        >
          <div className="w-0.5 h-2 bg-white rounded-full" />
        </div>
      </div>
    </div>
  )
}
