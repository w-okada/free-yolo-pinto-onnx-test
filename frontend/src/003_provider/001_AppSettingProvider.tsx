import React, { useContext } from "react";
import { ReactNode } from "react";
import { ApplicationSettingManagerStateAndMethod, useApplicationSettingManager } from "../002_hooks/000_useApplicationSettingManager";
import { useWindowStateChangeListener, WindowState } from "../002_hooks/001_useWindowStateChangeListener";
import { DeviceManagerStateAndMethod, useDeviceManager } from "../002_hooks/002_useDeviceManager";

type Props = {
    children: ReactNode;
};

type AppSettingValue = {
    applicationSettingState: ApplicationSettingManagerStateAndMethod;
    windowState: WindowState
    deviceManagerState: DeviceManagerStateAndMethod
};

const AppSettingContext = React.createContext<AppSettingValue | null>(null);
export const useAppSetting = (): AppSettingValue => {
    const state = useContext(AppSettingContext);

    if (!state) {
        throw new Error("useAppSetting must be used within AppSettingProvider");
    }
    return state;
};

export const AppSettingProvider = ({ children }: Props) => {
    const applicationSettingState = useApplicationSettingManager();
    const windowState = useWindowStateChangeListener()
    const deviceManagerState = useDeviceManager();
    const providerValue = {
        applicationSettingState,
        windowState,
        deviceManagerState,
    };

    return <AppSettingContext.Provider value={providerValue}> {children} </AppSettingContext.Provider>;
};
