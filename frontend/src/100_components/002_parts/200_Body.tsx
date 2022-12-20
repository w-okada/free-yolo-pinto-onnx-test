import React, { useEffect, useMemo } from "react";
import { useAppSetting } from "../../003_provider/001_AppSettingProvider";

import { useAppState } from "../../003_provider/003_AppStateProvider";
import { TARGET_CANVAS_ID, TARGET_IMAGE_ID, TARGET_VIDEO_ID, TEMPORARY_CANVAS_ID, TEMPORARY_HUMAN_CANVAS_CONTAINER_ID } from "../../const";

export const Body = () => {
    const { deviceManagerState } = useAppSetting()
    const { frontendManagerState } = useAppState()

    useEffect(() => {
        if (frontendManagerState.mediaType === "image") {
            const img = document.getElementById(TARGET_IMAGE_ID) as HTMLImageElement
            img.onload = () => {
                const image = new Image();
                image.src = img.getAttribute('src') || "";
                // console.log("IMAGE LOADED:", img.width, img.height, )
                frontendManagerState.setInputResolution([image.width, image.height])
            }
            img.src = frontendManagerState.mediaURL
        } else if (frontendManagerState.mediaType === "movie") {
            const video = document.getElementById(TARGET_VIDEO_ID) as HTMLVideoElement
            video.pause()
            video.onloadedmetadata = function () {
                // console.log("VIDEO LOADED1:", video.videoWidth, video.videoHeight)
                frontendManagerState.setInputResolution([video.videoWidth, video.videoHeight])
            }
            video.srcObject = null
            video.src = frontendManagerState.mediaURL
            video.play()
        } else if (frontendManagerState.mediaType === "screen" || frontendManagerState.mediaType === "camera") {
            const video = document.getElementById(TARGET_VIDEO_ID) as HTMLVideoElement
            video.pause()
            video.onloadedmetadata = function () {
                // console.log("VIDEO LOADED2:", video.videoWidth, video.videoHeight)
                frontendManagerState.setInputResolution([video.videoWidth, video.videoHeight])
            }
            video.srcObject = null
            video.srcObject = frontendManagerState.mediaStream
            video.play()
        }

    }, [frontendManagerState.mediaType, frontendManagerState.mediaStream, frontendManagerState.mediaURL, deviceManagerState.videoInputDeviceId])

    const content = useMemo(() => {
        const videoClass = frontendManagerState.mediaType === "image" ? "body-video hide" : "body-video"
        const imageClass = frontendManagerState.mediaType === "image" ? "body-video" : "body-video hide"
        return (
            <div className="body-content">
                <div className="body-content-upper" id="body-content-upper">
                    <div id="body-video-container" className="body-video-container">
                        <div className="body-video-left">
                            <video id={TARGET_VIDEO_ID} className={videoClass} controls></video>
                            <img id={TARGET_IMAGE_ID} className={imageClass} />
                        </div>
                        <div className="body-video-right">
                            <canvas id={TARGET_CANVAS_ID} className="body-video" />
                        </div>
                    </div>
                </div>
                <div className="body-content-lower" id="body-content-lower">
                    <div className="temporary-human-canvas-container" id={TEMPORARY_HUMAN_CANVAS_CONTAINER_ID}>
                    </div>
                    <div className="temporary-canvas-container" >
                        <canvas id={TEMPORARY_CANVAS_ID} className="temporary-canvas" />
                    </div>

                </div>
            </div>
        );
    }, [frontendManagerState.mediaType])
    return (
        <>
            {content}
        </>
    )
};
