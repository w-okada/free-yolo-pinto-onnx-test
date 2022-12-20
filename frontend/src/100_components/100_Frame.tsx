import React, { useEffect } from "react";
import { useAppState } from "../003_provider/003_AppStateProvider";
import { Header } from "./002_parts/100_Header";
import { Body } from "./002_parts/200_Body";
import { RightSidebar } from "./002_parts/300_RightSidebar";
import { Dialog } from "./002_parts/900_Dialog";

export const Frame = () => {
    const { frontendManagerState } = useAppState();
    useEffect(() => {
        frontendManagerState.stateControls.openRightSidebarCheckbox.updateState(true);
    }, []);
    return (
        <>
            <div className="header-container">
                <Header></Header>
            </div>
            {frontendManagerState.stateControls.openRightSidebarCheckbox.trigger}
            <div className="body-container" id="body-container">
                <Body></Body>
            </div>
            {frontendManagerState.stateControls.openRightSidebarCheckbox.trigger}
            <div className="right-sidebar-container">
                <RightSidebar></RightSidebar>
            </div>
            <Dialog />
        </>
    );
};
