import { InferenceSession, Tensor } from "onnxruntime-web";
import { BoundingBox } from "./200_useInference";

type InferWithONNXOption = {
    _updatePerfCounterInference: (counter: number) => void | undefined
}
export const useInferWithONNX = () => {
    const _inferWithONNX = async (session: InferenceSession, canvas: HTMLCanvasElement, inputShapeArray: number[], ratio: number, opt: InferWithONNXOption) => {

        // generate input tensor
        //// get source image data (input tensor size)
        const ctx = canvas.getContext("2d")!
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const [redArray, greenArray, blueArray] = new Array(new Array<number>(), new Array<number>(), new Array<number>());
        //// get RGB Data
        for (let i = 0; i < imageData.data.length; i += 4) {
            redArray.push(imageData.data[i]);
            greenArray.push(imageData.data[i + 1]);
            blueArray.push(imageData.data[i + 2]);
            // skip data[i + 3] to filter out the alpha channel
        }
        //// Transpose
        const transposedData = blueArray.concat(greenArray).concat(redArray);
        const float32Data = new Float32Array(3 * inputShapeArray[0] * inputShapeArray[1]);
        for (let i = 0; i < transposedData.length; i++) {
            float32Data[i] = transposedData[i] / 1.0
        }
        //// Generate
        const inputTensor = new Tensor("float32", float32Data, [1, 3, inputShapeArray[0], inputShapeArray[1]]);

        // Process YOLOX
        const feeds = { input: inputTensor };
        const perfCounterInference_start = performance.now()
        const results = await session.run(feeds)
        const perfCounterInference_end = performance.now()
        const perfCounterInference = perfCounterInference_end - perfCounterInference_start
        if (opt._updatePerfCounterInference) {
            opt._updatePerfCounterInference(perfCounterInference)
        }


        const rects = results.batchno_classid_x1y1x2y2
        const scores = results.score

        const bbs: BoundingBox[] = []
        for (let i = 0; i < rects.data.length; i += 6) {
            // const _batch = Number(rects.data[i + 0])
            const classId = Number(rects.data[i + 1])
            const x1 = Number(rects.data[i + 2]) / ratio
            const y1 = Number(rects.data[i + 3]) / ratio
            const x2 = Number(rects.data[i + 4]) / ratio
            const y2 = Number(rects.data[i + 5]) / ratio
            const bb: BoundingBox = {
                startX: x1,
                startY: y1,
                endX: x2,
                endY: y2,
                classIdx: classId,
                score: scores.data[i / 6] as number
            }
            bbs.push(bb)
        }
        return bbs
    }
    return { _inferWithONNX }
}
