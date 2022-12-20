import React, { useMemo } from "react";
import { MediaType } from "../../002_hooks/100_useFrontendManager";
import { EngineType, InputShape, ModelType } from "../../002_hooks/200_useInference";
import { useAppSetting } from "../../003_provider/001_AppSettingProvider";
import { useAppState } from "../../003_provider/003_AppStateProvider";
import { PERFORMANCE_ALL_SPAN, PERFORMANCE_COSSIM_SPAN, PERFORMANCE_FPS_SPAN, PERFORMANCE_INFER_SPAN, PERFORMANCE_PERSON_NUM_SPAN, PERFORMANCE_REID_SPAN, STATUS_WARMUP_SPAN } from "../../const";
import { useFileInput } from "../003_hooks/useFileInput";

export const InputSourceSelector = () => {
    const { deviceManagerState } = useAppSetting()
    const { inferenceState, frontendManagerState } = useAppState()
    const { click } = useFileInput()

    /***********************
     * Input Source Area
     ***********************/
    const mediaTypeRow = useMemo(() => {
        const options = Object.keys(MediaType).map(x => {
            return (
                <option key={x} value={x}>
                    {x}
                </option>
            )
        })

        const select = (
            <select
                value={frontendManagerState.mediaType}
                onChange={(e) => {
                    const newMediaType = e.target.value as MediaType
                    if (newMediaType === "camera") {
                        deviceManagerState.reloadDevices()
                    }
                    frontendManagerState.setMediaType(e.target.value as MediaType);
                }}
                className="sidebar-content-row-select-select"
            >
                {options}
            </select>
        );

        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">Input:</div>
                <div className="sidebar-content-row-select">{select}</div>
            </div>

        )
    }, [frontendManagerState.mediaType])

    const fileChooserRow = useMemo(() => {
        if (frontendManagerState.mediaType !== "image" && frontendManagerState.mediaType !== "movie") {
            return <></>
        }

        const onChooseFileClicked = async () => {
            try {
                const sourceType = frontendManagerState.mediaType === "image" ? "image" : "video"
                const { url } = await click(sourceType)
                console.log("URL", URL)
                frontendManagerState.setMediaURL(url)
            } catch (exception) {
                alert(exception)
            }
        }
        return (
            <div className="sidebar-content-row-7-3">
                <div className="sidebar-content-row-label"></div>
                <div className="sidebar-content-row-buttons">
                    <div className="sidebar-content-row-button" onClick={() => onChooseFileClicked()}>Load File</div>
                </div>
            </div>
        )
    }, [frontendManagerState.mediaType])


    const cameraChooserRow = useMemo(() => {
        if (frontendManagerState.mediaType !== "camera") {
            return <></>
        }

        const options = deviceManagerState.videoInputDevices.map(x => {
            return (
                <option key={x.deviceId} value={x.deviceId}>
                    {x.label}
                </option>
            )
        })

        const value = deviceManagerState.videoInputDevices.find(x => { return x.deviceId === deviceManagerState.videoInputDeviceId })
        const select = (
            <select
                value={value?.deviceId || "none"}
                onChange={async (e) => {
                    frontendManagerState.mediaStream.getTracks().forEach(x => { x.stop() })
                    console.log("new deviceid1:", e.target.value)
                    if (e.target.value === "none") {
                        console.log("new deviceid2:", e.target.value)
                        deviceManagerState.setVideoInputDeviceId("none")
                        return
                    }
                    const newDeviceId = e.target.value
                    const options = {
                        audio: false,
                        video: {
                            deviceId: e.target.value,
                            width: { min: 640, ideal: 1280, max: 1920 },
                            height: { min: 480, ideal: 720, max: 1080 }
                        }
                    }
                    // @ts-ignore
                    const captureStream = await navigator.mediaDevices.getUserMedia(options);
                    frontendManagerState.setMediaStream(captureStream)
                    console.log("new deviceid3:", newDeviceId)
                    deviceManagerState.setVideoInputDeviceId(newDeviceId)
                }}
                className="sidebar-content-row-select-select"
            >
                {options}
            </select>
        );

        return (
            <div className="sidebar-content-row-3-7">
                <div className="sidebar-content-row-label">Camera:</div>
                <div className="sidebar-content-row-select">{select}</div>
            </div>
        )

    }, [frontendManagerState.mediaType, deviceManagerState.videoInputDeviceId, deviceManagerState.videoInputDevices])

    const screenChooserRow = useMemo(() => {
        if (frontendManagerState.mediaType !== "screen") {
            return <></>
        }

        const onChooseFileClicked = async () => {
            try {
                frontendManagerState.mediaStream.getTracks().forEach(x => { x.stop() })
                const options = {
                    video: {
                        cursor: "always"
                    },
                    audio: true
                }
                // @ts-ignore
                const captureStream = await navigator.mediaDevices.getDisplayMedia(options);
                frontendManagerState.setMediaStream(captureStream)
            } catch (exception) {
                console.log(exception)
            }
        }
        return (
            <div className="sidebar-content-row-3-7">
                <div className="sidebar-content-row-label"></div>
                <div className="sidebar-content-row-buttons">
                    <div className="sidebar-content-row-button" onClick={() => onChooseFileClicked()}>Select Screen</div>
                </div>
            </div>
        )
    }, [frontendManagerState.mediaType])

    const inputSourceResolutionRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">Resolution:</div>
                <div className="sidebar-content-row-label">[{frontendManagerState.inputResolution[0]},{frontendManagerState.inputResolution[1]}]</div>
            </div>
        )
    }, [frontendManagerState.inputResolution])

    /***********************
     * Performance Area
     ***********************/
    const performancFPSRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">FPS:</div>
                <div className="sidebar-content-row-label"><span id={PERFORMANCE_FPS_SPAN}></span></div>
            </div>
        )
    }, [])
    const performanceAllRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">All:</div>
                <div className="sidebar-content-row-label"><span id={PERFORMANCE_ALL_SPAN}></span>ms</div>
            </div>
        )
    }, [])
    const performanceInferenceRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label pad-left-1">Inference:</div>
                <div className="sidebar-content-row-label"><span id={PERFORMANCE_INFER_SPAN}></span>ms</div>
            </div>
        )
    }, [])


    const performanceReIdRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label pad-left-1">ReId:</div>
                <div className="sidebar-content-row-label"><span id={PERFORMANCE_REID_SPAN}></span>ms</div>
            </div>
        )
    }, [])

    const performanceCosSimRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label pad-left-1">CosSim:</div>
                <div className="sidebar-content-row-label"><span id={PERFORMANCE_COSSIM_SPAN}></span>ms</div>
            </div>
        )
    }, [])
    const performancePersonNumRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label pad-left-1">Person:</div>
                <div className="sidebar-content-row-label"><span id={PERFORMANCE_PERSON_NUM_SPAN}></span></div>
            </div>
        )
    }, [])




    const statusWarmupRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label pad-left-1">Status:</div>
                <div className="sidebar-content-row-label"><span id={STATUS_WARMUP_SPAN}></span></div>
            </div>
        )
    }, [])


    /***********************
     * Select Engine Area
     ***********************/
    const selectEngineRow = useMemo(() => {
        const options = Object.keys(EngineType).map(x => {
            return (
                <option key={x} value={x}>
                    {x}
                </option>
            )
        })

        const select = (
            <select
                value={inferenceState.engineType}
                onChange={(e) => {
                    const newEnginType = e.target.value as EngineType
                    inferenceState.setEnginType(newEnginType)
                }}
                className="sidebar-content-row-select-select"
            >
                {options}
            </select>
        );

        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">Engine Type:</div>
                <div className="sidebar-content-row-select">{select}</div>
            </div>

        )
    }, [inferenceState.engineType])

    const selectInputShapeRow = useMemo(() => {
        const options = Object.keys(InputShape).map(x => {
            return (
                <option key={x} value={x}>
                    {x}
                </option>
            )
        })

        const select = (
            <select
                value={inferenceState.inputShape}
                onChange={(e) => {
                    const newInputShape = e.target.value as InputShape
                    inferenceState.setInputShape(newInputShape)
                }}
                className="sidebar-content-row-select-select"
            >
                {options}
            </select>
        );

        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">InputShape:</div>
                <div className="sidebar-content-row-select">{select}</div>
            </div>

        )
    }, [inferenceState.inputShape])


    const selectModeType = useMemo(() => {
        const options = Object.keys(ModelType).map(x => {
            return (
                <option key={x} value={x}>
                    {x}
                </option>
            )
        })

        const select = (
            <select
                value={inferenceState.modelType}
                onChange={(e) => {
                    const newModelType = e.target.value as ModelType
                    inferenceState.setModelType(newModelType)
                }}
                className="sidebar-content-row-select-select"
            >
                {options}
            </select>
        );

        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">Model Type:</div>
                <div className="sidebar-content-row-select">{select}</div>
            </div>

        )
    }, [inferenceState.modelType])


    const processButtonRow = useMemo(() => {
        const buttonLabel = inferenceState.processId === 0 ? "start process" : "stop process"
        const buttonClass = inferenceState.processId === 0 ? "sidebar-content-row-button" : "sidebar-content-row-button-activated"
        const butonAction = inferenceState.processId === 0 ?
            () => {
                inferenceState.startProcess(frontendManagerState.mediaType, frontendManagerState.inputResolution, new Date().getTime())
            }
            :
            () => {
                inferenceState.stopProcess()
            }

        return (
            <div className="sidebar-content-row-3-7">
                <div className="sidebar-content-row-label"></div>
                <div className="sidebar-content-row-buttons">
                    <div className={buttonClass} onClick={butonAction}>{buttonLabel}</div>
                </div>
            </div>
        )
    }, [frontendManagerState.mediaType, frontendManagerState.inputResolution, inferenceState.processId, inferenceState.engineType, inferenceState.inputShape])



    return (
        <div className="sidebar-content">
            <div className="sidebar-content-row-label-header">
                Input Source
            </div>
            {mediaTypeRow}
            {fileChooserRow}
            {cameraChooserRow}
            {screenChooserRow}
            {inputSourceResolutionRow}


            <div className="sidebar-content-row-dividing"></div>
            <div className="sidebar-content-row-label-header">
                Inference Engine
            </div>
            {selectEngineRow}
            {selectInputShapeRow}
            {selectModeType}

            <div className="sidebar-content-row-dividing"></div>
            <div className="sidebar-content-row-label-header">
                Performance
            </div>
            {performancFPSRow}
            {performanceAllRow}
            {performanceInferenceRow}
            {performanceReIdRow}
            {performanceCosSimRow}
            {performancePersonNumRow}


            <div className="sidebar-content-row-dividing"></div>
            {processButtonRow}
            {statusWarmupRow}


        </div>
    );
};
