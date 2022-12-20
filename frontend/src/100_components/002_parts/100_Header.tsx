import React from "react";
import { RightSidebarButton } from "./102_RightSidebarButton";

export const Header = () => {
    return (
        <div className="header">
            <div className="header-application-title-container">
                <img src="./assets/icons/flect.png" className="header-application-title-logo"></img>
                <div className="header-application-title-text">Free-YOLO-TEST</div>
            </div>

            <div className="header-button-container">
                <a className="header-button-link" href="https://github.com/w-okada/free-yolo-pinto-onnx-test.git" target="_blank" rel="noopener noreferrer">
                    <img src="./assets/icons/github.svg" />
                </a>
                <div className="header-button-spacer"></div>
                <RightSidebarButton></RightSidebarButton>
            </div>
        </div>
    );
};
