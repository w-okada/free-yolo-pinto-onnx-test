const DefaultImage = require("../../../data/D0002011239_00000.jpg")

import { StateControlCheckbox, useStateControlCheckbox } from "../100_components/003_hooks/useStateControlCheckbox";
import { useState } from "react"
export const MediaType = {
    image: "image",
    movie: "movie",
    camera: "camera",
    screen: "screen"
} as const
export type MediaType = typeof MediaType[keyof typeof MediaType]


export type StateControls = {
    openRightSidebarCheckbox: StateControlCheckbox
    generalDialogCheckbox: StateControlCheckbox
}

type FrontendManagerState = {
    stateControls: StateControls
    mediaType: MediaType
    mediaURL: string
    mediaStream: MediaStream
    inputResolution: [number, number] // Width, Height
};

export type FrontendManagerStateAndMethod = FrontendManagerState & {
    setMediaType: (val: MediaType) => void
    setMediaURL: (val: string) => void
    setMediaStream: (val: MediaStream) => void
    setInputResolution: (val: [number, number]) => void
}

export const useFrontendManager = (): FrontendManagerStateAndMethod => {

    // (1) Controller Switch
    const openRightSidebarCheckbox = useStateControlCheckbox("open-right-sidebar-checkbox");
    // (2) Dialog
    const generalDialogCheckbox = useStateControlCheckbox("general-dialog-checkbox");

    const [mediaType, setMediaType] = useState<MediaType>("image")
    const [mediaURL, setMediaURL] = useState<string>(DefaultImage)
    const [mediaStream, setMediaStream] = useState<MediaStream>(new MediaStream())
    const [inputResolution, setInputResolution] = useState<[number, number]>([0, 0])


    const returnValue = {
        stateControls: {
            // (1) Controller Switch
            openRightSidebarCheckbox,
            generalDialogCheckbox,
        },
        mediaType,
        mediaURL,
        mediaStream,
        inputResolution,
        setMediaType,
        setMediaURL,
        setMediaStream,
        setInputResolution
    };
    return returnValue;
};
