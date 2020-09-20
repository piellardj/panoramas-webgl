import * as fs from "fs";
import * as path from "path";
import { Demopage } from "webpage-templates";

const data = {
    title: "Panoramas",
    description: "Simple panorama viewer and editor",
    introduction: [
        "This project is a simple tool for visualizing, editing and converting panoramas.",
        "It supports skysphere, skybox and tiny planet formats, and can convert from one another."
    ],
    githubProjectName: "panoramas-webgl",
    additionalLinks: [],
    scriptFiles: [
        "script/main.min.js"
    ],
    indicators: [],
    canvas: {
        width: 768,
        height: 512,
        enableFullscreen: true
    },
    controlsSections: [
        {
            title: "Input",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    id: "input-format",
                    unique: true,
                    options: [
                        {
                            value: "skybox",
                            label: "Skybox"
                        },
                        {
                            value: "skysphere",
                            label: "Skysphere",
                            checked: true
                        },
                        {
                            value: "tinyplanet",
                            label: "Tiny planet"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.FileUpload,
                    id: "file-upload-id",
                    defaultMessage: "Choose an image...",
                    accept: [
                        "image/bmp",
                        "image/png",
                        "image/jpeg"
                    ]
                }
            ]
        },
        {
            title: "Ouput",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    id: "output-format",
                    unique: true,
                    options: [
                        {
                            value: "skybox",
                            label: "Skybox",
                            checked: true
                        },
                        {
                            value: "skysphere",
                            label: "Skysphere"
                        },
                        {
                            value: "tinyplanet",
                            label: "Tiny planet"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Preview",
                    id: "output-preview-id",
                    checked: false
                },
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Quality",
                    id: "output-quality",
                    unique: true,
                    options: [
                        {
                            value: "25",
                            label: "25 %"
                        },
                        {
                            value: "50",
                            label: "50 %"
                        },
                        {
                            value: "100",
                            label: "100 %",
                            checked: true
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.FileDownload,
                    id: "file-download-id",
                    label: "Download",
                    flat: true
                }
            ]
        },
        {
            title: "Display",
            controls: [
                {
                    type: Demopage.supportedControls.Range,
                    title: "Field of view",
                    id: "fov-range-id",
                    min: 15,
                    max: 110,
                    value: 70,
                    step: 1
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Frame",
                    id: "frame-checkbox-id",
                    checked: false
                }
            ]
        },
        {
            title: "Edit",
            controls: [
                {
                    type: Demopage.supportedControls.Range,
                    title: "Pad top",
                    id: "padding-top-range-id",
                    min: 0,
                    max: 1,
                    value: 0,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Pad bottom",
                    id: "padding-bottom-range-id",
                    min: 0,
                    max: 1,
                    value: 0,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Pad back",
                    id: "padding-back-range-id",
                    min: 0,
                    max: 5,
                    value: 0,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Rotate Z",
                    id: "rotate-z-range-id",
                    min: 0,
                    max: 1,
                    value: 0,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Flip vertically",
                    id: "flip-vertically-checkbox-id",
                    checked: false
                }
            ]
        }
    ]
};

const DEST_DIR = path.resolve(__dirname, "..", "docs");
const minified = true;

const buildResult = Demopage.build(data, DEST_DIR, {
    debug: !minified,
});

// disable linting on this file because it is generated
buildResult.pageScriptDeclaration = "/* tslint:disable */\n" + buildResult.pageScriptDeclaration;

const SCRIPT_DECLARATION_FILEPATH = path.resolve(__dirname, ".", "ts", "page-interface-generated.ts");
fs.writeFileSync(SCRIPT_DECLARATION_FILEPATH, buildResult.pageScriptDeclaration);
