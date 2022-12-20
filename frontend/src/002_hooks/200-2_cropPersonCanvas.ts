import { BoundingBox } from "./200_useInference";

export const useCropPersonCanvas = () => {

    const _cropPersonCanvas = (originalCanvas: HTMLCanvasElement, boxes: BoundingBox[]) => {
        // Crop Human
        const humanCanvass = boxes.filter(x => { return x.classIdx === 0 }).map(x => {
            const c = document.createElement("canvas")
            c.width = 128
            c.height = 256
            const ctx = c.getContext("2d")!

            const startX = x.startX
            const startY = x.startY
            const endX = Math.min(x.endX, originalCanvas.width)
            const endY = Math.min(x.endY, originalCanvas.height)

            ctx.drawImage(originalCanvas, startX, startY, endX - startX, endY - startY, 0, 0, c.width, c.height)
            return c
        })
        return humanCanvass
    }
    return { _cropPersonCanvas }
}


