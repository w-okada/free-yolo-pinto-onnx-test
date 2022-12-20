import { useEffect, useRef, useState } from "react"
import { ApplicationSetting, fetchApplicationSetting, InitialApplicationSetting } from "../001_clients_and_managers/000_ApplicationSettingLoader"

export type ApplicationSettingManagerStateAndMethod = {
    applicationSetting: ApplicationSetting
}

const LOCAL_STORAGE_PREFIX = location.pathname
const LOCAL_STORAGE_APPLICATION_SETTING = `${LOCAL_STORAGE_PREFIX}_applicationSetting`
export const useApplicationSettingManager = (): ApplicationSettingManagerStateAndMethod => {
    const applicationSettingRef = useRef<ApplicationSetting>(InitialApplicationSetting)
    const [applicationSetting, setApplicationSetting] = useState<ApplicationSetting>(applicationSettingRef.current)

    /** (1) Initialize Setting */
    /** (1-1) Load from localstorage */
    const loadApplicationSetting = async () => {
        if (localStorage[LOCAL_STORAGE_APPLICATION_SETTING]) {
            applicationSettingRef.current = JSON.parse(localStorage[LOCAL_STORAGE_APPLICATION_SETTING]) as ApplicationSetting
            console.log("Load AppStteing from Local Storage", applicationSettingRef.current)
            setApplicationSetting({ ...applicationSettingRef.current })
        } else {
            applicationSettingRef.current = await fetchApplicationSetting()
            console.log("Load AppStteing from Server", applicationSettingRef.current)
            setApplicationSetting({ ...applicationSettingRef.current })
        }
    }
    useEffect(() => {
        loadApplicationSetting()
    }, [])

    return {
        applicationSetting,
    }
}
