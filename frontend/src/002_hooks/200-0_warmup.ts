import * as tf from '@tensorflow/tfjs';
import { TEMPORARY_CANVAS_ID } from '../const';
import { useInferWithTFJS } from './200-1_inferWithTFJS';


type InferWithONNXOption = {
    _updateWarmupProgress: (objectDetectionProgress: number, reIdProgress: number) => void | undefined
}
export const useWarmup = () => {
    const { _inferWithTFJS } = useInferWithTFJS()

    const _warmup = async (session: tf.GraphModel | null, inputShapeArray: number[], opt: InferWithONNXOption) => {
        try {
            if (opt._updateWarmupProgress) {
                opt._updateWarmupProgress(0, 0)
            }
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 100)
            })

            if (session) {
                const dummyCanvass = document.getElementById(TEMPORARY_CANVAS_ID) as HTMLCanvasElement
                dummyCanvass.height = inputShapeArray[0]
                dummyCanvass.width = inputShapeArray[1]
                await _inferWithTFJS(session, dummyCanvass, 1.0, {})
            }

            if (opt._updateWarmupProgress) {
                opt._updateWarmupProgress(1, 0)
            }
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 100)
            })


            if (opt._updateWarmupProgress) {
                opt._updateWarmupProgress(1, 1)
            }
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 100)
            })
        } catch (e) {
            console.error("WARMUP ERROR", e)
        }
    }


    return { _warmup }
}
