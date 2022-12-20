import { useRef, useState } from "react"
import { PERFORMANCE_ALL_SPAN, PERFORMANCE_COSSIM_SPAN, PERFORMANCE_FPS_SPAN, PERFORMANCE_INFER_SPAN, PERFORMANCE_PERSON_NUM_SPAN, PERFORMANCE_REID_SPAN, STATUS_WARMUP_SPAN, TARGET_CANVAS_ID, TARGET_IMAGE_ID, TARGET_VIDEO_ID, TEMPORARY_CANVAS_ID, } from "../const";
import { MediaType } from "./100_useFrontendManager";
import { InferenceSession } from 'onnxruntime-web';

import * as tf from '@tensorflow/tfjs';
import { useInferWithONNX } from "./200-1_inferWithONNX";
import { useInferWithTFJS } from "./200-1_inferWithTFJS";
import { useWarmup } from "./200-0_warmup";
import { useDrawDetectedBoxes } from "./200-3_drawDetectedBoxes";

export const EngineType = {
    onnx: "onnx",
    tfjs: "tfjs"
} as const
export type EngineType = typeof EngineType[keyof typeof EngineType]

export const InputShape = {
    "192x192": "192x192",
    "192x320": "192x320",
    "256x320": "256x320",
    "256x416": "256x416",
    "288x480": "288x480",
    "320x320": "320x320",
    "384x640": "384x640",
    "416x416": "416x416",
    "480x640": "480x640",
    "480x800": "480x800",
    "544x960": "544x960",
    "640x640": "640x640",
    "736x1280": "736x1280",
} as const
export type InputShape = typeof InputShape[keyof typeof InputShape]

export const ModelType = {
    "yolo_free_nano": "yolo_free_nano",
    "yolo_free_nano_crowdhuman": "yolo_free_nano_crowdhuman",
    "yolo_free_nano_widerface": "yolo_free_nano_widerface"

} as const
export type ModelType = typeof ModelType[keyof typeof ModelType]

const PerformancCounter_num = 10

export type BoundingBox = {
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    classIdx: number,
    score: number,
}

type WarmupProgress = {
    objectDetectionProgress: number
    reIdProgress: number
}


export type InferenceState = {
    processId: number
    engineType: EngineType
    inputShape: InputShape
    modelType: ModelType
    scoreThreshold: number
    skipRate: number
}

export type InferenceStateAndMethod = InferenceState & {
    startProcess: (type: MediaType, inputResolution: [number, number], processId: number) => Promise<void>
    stopProcess: () => Promise<void>
    setEnginType: (val: EngineType) => void
    setInputShape: (val: InputShape) => void
    setModelType: (val: ModelType) => void
    setScoreThreshold: (val: number) => void

    setSkipRate: (val: number) => void
}

export const useInference = (): InferenceStateAndMethod => {
    const frameCounterRef = useRef<number>(0)
    const skipRateRef = useRef<number>(0)
    const [skipRate, _setSkipRate] = useState<number>(skipRateRef.current)
    const setSkipRate = (val: number) => {
        skipRateRef.current = val
        _setSkipRate(skipRateRef.current)
    }

    const { _warmup } = useWarmup()
    const { _inferWithONNX } = useInferWithONNX()
    const { _inferWithTFJS } = useInferWithTFJS()
    const { _drawDetectedBoxes } = useDrawDetectedBoxes()

    const processIdRef = useRef<number>(0)
    const [processId, setProcessId] = useState<number>(processIdRef.current)
    const [engineType, setEnginType] = useState<EngineType>("onnx")
    const [inputShape, setInputShape] = useState<InputShape>("416x416")
    const [modelType, setModelType] = useState<ModelType>("yolo_free_nano")

    const scoreThresholdRef = useRef<number>(0.3)
    const [scoreThreshold, _setScoreThreshold] = useState<number>(scoreThresholdRef.current)
    const setScoreThreshold = (val: number) => {
        scoreThresholdRef.current = val
        _setScoreThreshold(scoreThresholdRef.current)
    }


    const perfCounterInferenceRef = useRef<number[]>([])
    const perfCounterReIdRef = useRef<number[]>([])
    const perfCounterCosSimIdRef = useRef<number[]>([])
    const perfCounterAllRef = useRef<number[]>([])
    const perfFrameCounterRef = useRef<number[]>([])
    const perfPersonNumRef = useRef<number>(0)
    const _updatePerfCounterInference = (counter: number) => {
        perfCounterInferenceRef.current.push(counter)
        while (perfCounterInferenceRef.current.length > PerformancCounter_num) {
            perfCounterInferenceRef.current.shift()
        }
        const perfCounterInferenceAvr = perfCounterInferenceRef.current.reduce((prev, cur) => {
            return prev + cur
        }) / perfCounterInferenceRef.current.length;
        (document.getElementById(PERFORMANCE_INFER_SPAN) as HTMLSpanElement).innerText = `${perfCounterInferenceAvr.toFixed(2)}`
    }

    const _updatePerfCounterReId = (counter: number) => {
        perfCounterReIdRef.current.push(counter)
        while (perfCounterReIdRef.current.length > PerformancCounter_num) {
            perfCounterReIdRef.current.shift()
        }
        const perfCounterReIdAvr = perfCounterReIdRef.current.reduce((prev, cur) => {
            return prev + cur
        }) / perfCounterReIdRef.current.length;
        (document.getElementById(PERFORMANCE_REID_SPAN) as HTMLSpanElement).innerText = `${perfCounterReIdAvr.toFixed(2)}`
    }

    const _updatePerfperfCounterCosSimId = (counter: number) => {
        perfCounterCosSimIdRef.current.push(counter)
        while (perfCounterCosSimIdRef.current.length > PerformancCounter_num) {
            perfCounterCosSimIdRef.current.shift()
        }
        const perfCounterCosSimIdAvr = perfCounterCosSimIdRef.current.reduce((prev, cur) => {
            return prev + cur
        }) / perfCounterCosSimIdRef.current.length;
        (document.getElementById(PERFORMANCE_COSSIM_SPAN) as HTMLSpanElement).innerText = `${perfCounterCosSimIdAvr.toFixed(2)}`
    }

    const _updatePerfCounterAll = (counter: number) => {
        perfCounterAllRef.current.push(counter)
        while (perfCounterAllRef.current.length > PerformancCounter_num) {
            perfCounterAllRef.current.shift()
        }
        const perfCounterAllAvr = perfCounterAllRef.current.reduce((prev, cur) => {
            return prev + cur
        }) / perfCounterAllRef.current.length;
        (document.getElementById(PERFORMANCE_ALL_SPAN) as HTMLSpanElement).innerText = `${perfCounterAllAvr.toFixed(2)}`
    }

    const _updatePerfFrameCounter = (counter: number) => {
        perfFrameCounterRef.current.push(counter)
        while (perfFrameCounterRef.current.length > PerformancCounter_num) {
            perfFrameCounterRef.current.shift()
        }
        const elapse = perfFrameCounterRef.current[perfFrameCounterRef.current.length - 1] - perfFrameCounterRef.current[0]
        const average = elapse / perfFrameCounterRef.current.length
        const fps = 1 * 1000 / average;
        // (document.getElementById(PERFORMANCE_FPS_SPAN) as HTMLSpanElement).innerText = `${fps.toFixed(2)}[${average.toFixed(2)}ms/frame]`
        (document.getElementById(PERFORMANCE_FPS_SPAN) as HTMLSpanElement).innerText = `${fps.toFixed(2)}`
    }

    const _updatePerfPersonNum = (counter: number) => {
        perfPersonNumRef.current = counter;
        (document.getElementById(PERFORMANCE_PERSON_NUM_SPAN) as HTMLSpanElement).innerText = `${perfPersonNumRef.current}`
    }

    const warmupProgressRef = useRef<WarmupProgress>({
        objectDetectionProgress: 0,
        reIdProgress: 0
    })
    const _updateWarmupProgress = (objectDetectionProgress: number, reIdProgress: number) => {
        warmupProgressRef.current = { objectDetectionProgress, reIdProgress }
        const span = document.getElementById(STATUS_WARMUP_SPAN) as HTMLSpanElement
        if (warmupProgressRef.current.objectDetectionProgress != 1) {
            span.innerText = `initializing... ${(warmupProgressRef.current.objectDetectionProgress * 100 / 2).toFixed(0)}%`
        } else if (warmupProgressRef.current.reIdProgress != 1) {
            span.innerText = `initializing... ${(warmupProgressRef.current.objectDetectionProgress * 100 / 2 + warmupProgressRef.current.reIdProgress * 100 / 2).toFixed(0)}%`
        } else {
            span.innerText = `initialized`
        }
    }

    const stopProcess = async () => {
        processIdRef.current = 0
        setProcessId(processIdRef.current)
    }

    const startProcess = async (type: MediaType, inputResolution: [number, number], processId: number) => {
        if (inputResolution[0] == 0) {
            console.log("input resolution is 0")
            return
        }
        // Params for GUI
        //// ProcessId
        processIdRef.current = processId
        setProcessId(processIdRef.current)
        const thisProcessId = processId

        //// inputShape
        const inputShapeArray = inputShape.split("x").map(x => { return Number(x) })

        // Model File
        const modelFilePath = engineType == "onnx" ?
            `./models/${modelType}_${inputShape}_post.onnx` : `./models/tfjs_${modelType}_${inputShape}_post/model.json`

        // Target Video/Image and Target Canvas
        const srcId = type === "image" ? TARGET_IMAGE_ID : TARGET_VIDEO_ID
        const srcVideo = document.getElementById(srcId) as HTMLImageElement | HTMLVideoElement
        const dstCanvas = document.getElementById(TARGET_CANVAS_ID) as HTMLCanvasElement
        dstCanvas.width = inputResolution[0]
        dstCanvas.height = inputResolution[1]

        const cacheCanvas = document.createElement("canvas")
        cacheCanvas.height = inputResolution[0]
        cacheCanvas.width = inputResolution[1]

        // Tmp Canvas (setup width/height to input tensor shape)
        const tmpCanvas = document.getElementById(TEMPORARY_CANVAS_ID) as HTMLCanvasElement
        tmpCanvas.height = inputShapeArray[0]
        tmpCanvas.width = inputShapeArray[1]



        // Calc image size on Tmp Canvas
        const ratio = Math.min(inputShapeArray[1] / inputResolution[0], inputShapeArray[0] / inputResolution[1])
        const width = inputResolution[0] * ratio
        const height = inputResolution[1] * ratio
        // Show Canvas Information
        console.log("Process Configuration")
        console.log(`
            Original_Image_Size: (w:${inputResolution[0]}, h:${inputResolution[1]}), 
            Tensor_Shape: (h:${inputShapeArray[0]}, w:${inputShapeArray[1]}),
            Image Ratio and Size on Tensor: (ratio:${ratio}, w:${width}, h:${height})
            `)

        // Create Session
        const session = engineType == "onnx" ?
            await InferenceSession.create(modelFilePath)
            :
            await tf.loadGraphModel(modelFilePath);


        if (engineType == "onnx") {
            await _warmup(null, inputShapeArray, { _updateWarmupProgress })
        } else {
            await _warmup(session as tf.GraphModel, inputShapeArray, { _updateWarmupProgress })
        }



        // Main Process Function
        const process = async (prevBox: BoundingBox[]) => {
            frameCounterRef.current++


            const perfCounterAll_start = performance.now()
            // Copy snapshot of target video/image to target canvas (same size)
            const cacheCanvasCtx = cacheCanvas.getContext("2d")!
            cacheCanvasCtx.drawImage(srcVideo, 0, 0, cacheCanvas.width, cacheCanvas.height)

            // Clear tmp canvas with grey (input tensor shape size)
            const tmpCtx = tmpCanvas.getContext("2d")!
            tmpCtx.fillStyle = "rgb(114, 114, 114)";
            tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height)

            // draw snapshot image to tmp canvas (image size resized with ratio). Dst and snapshot is same canvas.
            tmpCtx.drawImage(cacheCanvas, 0, 0, width, height)

            // check skip Inference or not in this frame
            _updatePerfFrameCounter(new Date().getTime())
            if (frameCounterRef.current % (skipRateRef.current + 1) !== 0) {
                const dstCanvasCtx = dstCanvas.getContext("2d")!
                dstCanvasCtx.drawImage(cacheCanvas, 0, 0, dstCanvas.width, dstCanvas.height)
                _drawDetectedBoxes(dstCanvasCtx, prevBox)
                requestAnimationFrame(() => { process(prevBox) })
                return
            }


            // Inference
            let targetBox: BoundingBox[] = []
            if (engineType == "onnx") {
                targetBox = await _inferWithONNX(session as InferenceSession, tmpCanvas, inputShapeArray, ratio, { _updatePerfCounterInference })
            } else {
                targetBox = await _inferWithTFJS(session as tf.GraphModel, tmpCanvas, ratio, { _updatePerfCounterInference })
            }
            console.log("TARGET1", targetBox)
            targetBox = targetBox.filter(x => { return x.score > scoreThresholdRef.current })

            console.log("TARGET2", targetBox)

            const dstCanvasCtx = dstCanvas.getContext("2d")!
            dstCanvasCtx.drawImage(cacheCanvas, 0, 0, dstCanvas.width, dstCanvas.height)
            _drawDetectedBoxes(dstCanvasCtx, targetBox)

            const perfCounterAll_end = performance.now()
            const perfCounterAll = perfCounterAll_end - perfCounterAll_start
            _updatePerfCounterAll(perfCounterAll)

            if (thisProcessId === processIdRef.current) {
                // console.log(`next process loop (this:${thisProcessId}, current:${processIdRef.current})`)
                requestAnimationFrame(() => { process(targetBox) })
            } else {
                // console.log(`stop process loop (this:${thisProcessId}, current:${processIdRef.current})`)
            }
        }
        requestAnimationFrame(() => { process([]) })
    }

    const returnValue = {
        processId,
        engineType,
        inputShape,
        modelType,
        scoreThreshold,
        startProcess,
        stopProcess,
        setEnginType,
        setInputShape,
        setModelType,
        setScoreThreshold,

        skipRate,
        setSkipRate,
    };
    return returnValue;
};


