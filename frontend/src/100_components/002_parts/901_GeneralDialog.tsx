import React from "react";
import { useAppState } from "../../003_provider/003_AppStateProvider";


export const GeneralSettingDialog = () => {
    const { frontendManagerState } = useAppState();

    return (
        <div className="dialog-frame">
            <div className="dialog-title">General ffmpeg cli Info</div>
            <div className="dialog-content">

                <div className="dialog-content-row-spacer"></div>

                <div className="dialog-content-row-4-4-2">
                    <div className="dialog-content-row-label">ID</div>
                    <div className="dialog-content-row-label">Name</div>
                    <div className="dialog-content-row-label"></div>
                </div>
                <div className="dialog-content-row-4-4-2">
                </div>

                <div className="dialog-content-row-spacer"></div>
                <div className="dialog-content-row-dividing"></div>
                <div className="dialog-content-row-2-2-2-2-2">
                    <div className="dialog-content-row-label"></div>
                    <div className="dialog-content-row-button" onClick={() => {
                        frontendManagerState.stateControls.generalDialogCheckbox.updateState(false)
                    }}>close</div>
                    <div className="dialog-content-row-label"></div>
                </div>

                <div className="dialog-content-row-spacer"></div>
                <div className="dialog-content-row-spacer"></div>

            </div>
        </div>

    )
};
