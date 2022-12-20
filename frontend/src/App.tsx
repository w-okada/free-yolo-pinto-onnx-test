import React, { useMemo } from "react";
import "./100_components/001_css/001_App.css";
import { Frame } from "./100_components/100_Frame";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { ErrorBoundary } from 'react-error-boundary'

library.add(fas, far, fab);

const MyFallbackComponent = () => {
    console.log("FALLBACK")
    return (
        <div role="alert">
            <p>Something went wrong: clear setting and reloading...</p>
        </div>
    )
}

const App = () => {

    const frame = useMemo(() => {
        return <Frame />
    }, [])
    return (
        <ErrorBoundary
            FallbackComponent={MyFallbackComponent}
            onError={(error, errorInfo) => {
                console.log(error, errorInfo)
                // applicationSettingState.clearSetting()
                // location.reload()
            }}
            onReset={() => {
                console.log("RESET!")
                // applicationSettingState.clearSetting()
            }}
        >
            <div className="application-container">{frame}</div>

        </ErrorBoundary>

    )

};
export default App;
