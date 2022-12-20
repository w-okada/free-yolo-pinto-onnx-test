import React, { useContext } from "react";
import { ReactNode } from "react";
import { FrontendManagerStateAndMethod, useFrontendManager } from "../002_hooks/100_useFrontendManager";
import { useEffect } from "react"
import { InferenceStateAndMethod, useInference } from "../002_hooks/200_useInference";

type Props = {
    children: ReactNode;
};

interface AppStateValue {
    frontendManagerState: FrontendManagerStateAndMethod;
    inferenceState: InferenceStateAndMethod
}

const AppStateContext = React.createContext<AppStateValue | null>(null);
export const useAppState = (): AppStateValue => {
    const state = useContext(AppStateContext);
    if (!state) {
        throw new Error("useAppState must be used within AppStateProvider");
    }
    return state;
};

export const AppStateProvider = ({ children }: Props) => {
    const frontendManagerState = useFrontendManager();
    const inferenceState = useInference();

    useEffect(() => {
        inferenceState.stopProcess()
    }, [
        frontendManagerState.mediaType,
        frontendManagerState.inputResolution,
        inferenceState.engineType,
        inferenceState.inputShape,
        inferenceState.modelType,
    ])

    const providerValue: AppStateValue = {
        frontendManagerState,
        inferenceState,
    };

    return <AppStateContext.Provider value={providerValue}>{children}</AppStateContext.Provider>;
};
