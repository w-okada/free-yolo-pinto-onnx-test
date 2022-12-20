import React, { useMemo } from "react";
import { useAppState } from "../../003_provider/003_AppStateProvider";

export const AdvancedSetting = () => {
    const { inferenceState } = useAppState()

    /***********************
     *  Threshold Area
     ***********************/
    const skipRateRow = useMemo(() => {
        const input = (
            <input type="range"
                max={5}
                min={0}
                step={1}
                value={inferenceState.skipRate}
                onChange={(e) => {
                    inferenceState.setSkipRate(Number(e.target.value))
                }}
            />
        )
        return (
            <div className="sidebar-content-row-4-5-1">
                <div className="sidebar-content-row-label">
                    skip rate
                </div>
                <div className="sidebar-content-row-input">
                    {input}
                </div>
                <div className="sidebar-content-row-label">{inferenceState.skipRate}</div>
            </div>
        )
    }, [inferenceState.skipRate])

    const scoreThresholdRow = useMemo(() => {
        const input = (
            <input type="range"
                max={1}
                min={0.1}
                step={0.1}
                value={inferenceState.scoreThreshold}
                onChange={(e) => {
                    inferenceState.setScoreThreshold(Number(e.target.value))
                }}
            />
        )
        return (
            <div className="sidebar-content-row-4-5-1">
                <div className="sidebar-content-row-label">
                    Detect Score
                </div>
                <div className="sidebar-content-row-input">
                    {input}
                </div>
                <div className="sidebar-content-row-label">{inferenceState.scoreThreshold}</div>
            </div>
        )
    }, [inferenceState.scoreThreshold])


    /***********************
     *  Threshold Area
     ***********************/



    return (
        <div className="sidebar-content">
            <div className="sidebar-content-row-label-header">
                Thresholds
            </div>
            {skipRateRow}
            {scoreThresholdRow}

        </div>
    );
};
