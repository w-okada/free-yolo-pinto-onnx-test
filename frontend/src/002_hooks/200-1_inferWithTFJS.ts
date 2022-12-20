import { BoundingBox } from "./200_useInference";
import * as tf from '@tensorflow/tfjs';

type InferWithTFJSOption = {
    _updatePerfCounterInference?: (counter: number) => void
}

export const useInferWithTFJS = () => {
    const _inferWithTFJS = async (session: tf.GraphModel, canvas: HTMLCanvasElement, ratio: number, opt: InferWithTFJSOption) => {

        const t = tf.browser.fromPixels(canvas).expandDims(0).cast("float32");
        // Process YOLOX
        const perfCounterInference_start = performance.now()
        // let prediction = (session.predict(t) as tf.Tensor).squeeze();
        let prediction = await session.executeAsync(t) as [tf.Tensor, tf.Tensor];
        const perfCounterInference_end = performance.now()
        const perfCounterInference = perfCounterInference_end - perfCounterInference_start
        if (opt._updatePerfCounterInference) {
            opt._updatePerfCounterInference(perfCounterInference)
        }
        t.dispose()
        const rects = prediction[0].dataSync()
        const scores = prediction[1].dataSync()

        prediction[0].dispose()
        prediction[1].dispose()

        const bbs: BoundingBox[] = []
        for (let i = 0; i < rects.length; i += 6) {
            const batch = Number(rects[i + 0])
            const classId = Number(rects[i + 1])
            const x1 = Number(rects[i + 2]) / ratio
            const y1 = Number(rects[i + 3]) / ratio
            const x2 = Number(rects[i + 4]) / ratio
            const y2 = Number(rects[i + 5]) / ratio
            const bb: BoundingBox = {
                startX: x1,
                startY: y1,
                endX: x2,
                endY: y2,
                classIdx: classId,
                score: scores[i / 6]
            }
            bbs.push(bb)
        }
        return bbs
    }
    return { _inferWithTFJS }
}
