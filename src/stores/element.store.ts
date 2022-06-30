import { atom, atomFamily } from "recoil";

export const elementsState = atom<number[]>({
  key: 'elements',
  default: []
})

export type CommonState = {
  style: {
      top: number
      left: number
      width: number
      height: number
  }
}

type RectangleState = {
  type: 'rectangle'
  color: string
}

type SvgState = {
  type: 'svg',
  html: string,
}

type ImageState = {
  type: 'image'
  src: string
}

export type ElementState = CommonState & (RectangleState | ImageState | SvgState)

export const defaultStyle = {
  top: 20,
  left: 20,
  width: 200,
  height: 170,
}

export const elementState = atomFamily<ElementState, number>({
  key: 'element',
  default: () => ({
    type: 'rectangle',
    style: defaultStyle,
    color: '#2345f4'
  })
})