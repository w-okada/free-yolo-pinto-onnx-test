import * as React from "react";
import { createRoot } from "react-dom/client";
import { AppSettingProvider } from "./003_provider/001_AppSettingProvider";
import { AppRootStateProvider } from "./003_provider/002_AppRootStateProvider";
import "./100_components/001_css/001_App.css";
import { AppStateProvider } from "./003_provider/003_AppStateProvider";
import App from "./App";

const AppStateProviderWrapper = () => {
    return (
        <AppStateProvider>
            <App />
        </AppStateProvider>
    );
};


const AppRootStateProviderWrapper = () => {
    return (
        <AppRootStateProvider>
            <AppStateProviderWrapper></AppStateProviderWrapper>
        </AppRootStateProvider>
    );
};

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(
    <AppSettingProvider>
        <AppRootStateProviderWrapper></AppRootStateProviderWrapper>
    </AppSettingProvider>
);