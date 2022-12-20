import React from "react";
import { useAppState } from "../../003_provider/003_AppStateProvider";
import { GeneralSettingDialog } from "./901_GeneralDialog";
export const Dialog = () => {
    const { frontendManagerState } = useAppState();

    return (
        <div>
            {frontendManagerState.stateControls.generalDialogCheckbox.trigger}
            <div className="dialog-container">
                {frontendManagerState.stateControls.generalDialogCheckbox.trigger}
                <GeneralSettingDialog />
            </div>
        </div>
    );
};
