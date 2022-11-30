import { Format, FormatUtils } from "./format-utils";

import "./page-interface-generated";

type OnChangeCallback = () => void;

const onChangeObservers = new Array<OnChangeCallback>();
function callOnChangeObservers(): void {
    for (const callback of Parameters.onChangeObservers) {
        callback();
    }
}

type OnImageLoadCallback = (img: HTMLImageElement) => void;
const onImageLoadObservers = new Array<OnImageLoadCallback>();

let image: HTMLImageElement;

const FILE_UPLOAD_CONTROL = "file-upload-id";
Page.FileControl.addUploadObserver(FILE_UPLOAD_CONTROL, (files: FileList) => {
    Page.Canvas.showLoader(true);

    const reader = new FileReader();

    reader.onload = () => {
        Parameters.image = new Image();
        Parameters.image.src = reader.result as any;
    };

    reader.readAsDataURL(files[0]);
});

type OnInputFormatChangeCallback = (previous: Format, newOne: Format) => void;
const onInputFormatChangeObservers = new Array<OnInputFormatChangeCallback>();

let inputFormat: Format;
const INPUT_FORMAT_CONTROL = "input-format";
Page.Tabs.addObserver(INPUT_FORMAT_CONTROL, (values: string[]) => {
    const previous = inputFormat;
    inputFormat = FormatUtils.parseString(values[0]);

    for (const callback of onInputFormatChangeObservers) {
        callback(previous, inputFormat);
    }
});

let outputFormat: Format;
const OUTPUT_FORMAT_CONTROL = "output-format";
Page.Tabs.addObserver(OUTPUT_FORMAT_CONTROL, (values: string[]) => {
    outputFormat = FormatUtils.parseString(values[0]);
    callOnChangeObservers();
});

let outputPreview: boolean;
const OUTPUT_PREVIEW_CONTROL = "output-preview-id";
Page.Checkbox.addObserver(OUTPUT_PREVIEW_CONTROL, (checked: boolean) => {
    outputPreview = checked;
    callOnChangeObservers();
});

let fov: number;
const FOV_CONTROL = "fov-range-id";
Page.Range.addObserver(FOV_CONTROL, (newFov: number) => {
    fov = Math.PI / 180 * newFov;
    callOnChangeObservers();
});

let showFrame: boolean;
const FRAME_CONTROL = "frame-checkbox-id";
Page.Checkbox.addObserver(FRAME_CONTROL, (checked: boolean) => {
    showFrame = checked;
    callOnChangeObservers();
});

let paddingTOP: number;
const PADDING_TOP_CONTROL = "padding-top-range-id";
Page.Range.addObserver(PADDING_TOP_CONTROL, (margin: number) => {
    paddingTOP = margin;
    callOnChangeObservers();
});

let paddingBottom: number;
const PADDING_BOTTOM_CONTROL = "padding-bottom-range-id";
Page.Range.addObserver(PADDING_BOTTOM_CONTROL, (margin: number) => {
    paddingBottom = margin;
    callOnChangeObservers();
});

let paddingBack: number;
const PADDING_BACK_CONTROL = "padding-back-range-id";
Page.Range.addObserver(PADDING_BACK_CONTROL, (margin: number) => {
    paddingBack = margin;
    callOnChangeObservers();
});

let rotateZ: number;
const ROTATE_Z_CONTROL = "rotate-z-range-id";
Page.Range.addObserver(ROTATE_Z_CONTROL, (r: number) => {
    rotateZ = r;
    callOnChangeObservers();
});

let flipVertically: boolean;
const FLIP_VERTICALLY_CONTROL = "flip-vertically-checkbox-id";
Page.Checkbox.addObserver(FLIP_VERTICALLY_CONTROL, (checked: boolean) => {
    flipVertically = checked;
    callOnChangeObservers();
});

Page.Canvas.Observers.mouseWheel.push((delta: number) => {
    Parameters.fov += delta * 10 * Math.PI / 180;
});

class Parameters {
    private constructor() { }

    public static get onChangeObservers(): OnChangeCallback[] {
        return onChangeObservers;
    }

    public static get onInputFormatChangeObservers(): OnInputFormatChangeCallback[] {
        return onInputFormatChangeObservers;
    }

    public static get onImageLoadObservers(): OnImageLoadCallback[] {
        return onImageLoadObservers;
    }

    public static set image(img: HTMLImageElement) {
        const ERROR_MESSAGE_ID = "invalid-image";

        image = img;
        image.addEventListener("load", () => {
            Page.Demopage.removeErrorMessage(ERROR_MESSAGE_ID);
            for (const callback of onImageLoadObservers) {
                callback(image);
            }

            callOnChangeObservers();
        });

        image.addEventListener("error", () => {
            Page.Demopage.setErrorMessage(ERROR_MESSAGE_ID, "The image could not be loaded.");
            Page.Canvas.showLoader(false);
            console.error("Image could not be loaded.");
        });
    }
    public static get image(): HTMLImageElement {
        return image;
    }

    public static set inputFormat(value: Format) {
        inputFormat = value;
        Page.Tabs.setValues(INPUT_FORMAT_CONTROL, [value]);
        callOnChangeObservers();
    }
    public static get inputFormat(): Format {
        return inputFormat;
    }

    public static set previewOutput(show: boolean) {
        outputPreview = show;
        Page.Checkbox.setChecked(OUPUT_PREVIEW_CONTROL, show);
        callOnChangeObservers();
    }
    public static get previewOutput(): boolean {
        return outputPreview;
    }

    public static set outputFormat(value: Format) {
        outputFormat = value;
        Page.Tabs.setValues(OUTPUT_FORMAT_CONTROL, [value]);
        callOnChangeObservers();
    }
    public static get outputFormat(): Format {
        return outputFormat;
    }

    public static get outputPercentage(): number {
        return +Page.Tabs.getValues("output-quality")[0] / 100;
    }

    public static set fov(value: number) {
        Page.Range.setValue(FOV_CONTROL, value * 180 / Math.PI);
        fov = Page.Range.getValue(FOV_CONTROL) * Math.PI / 180;
        callOnChangeObservers();
    }
    public static get fov(): number {
        return fov;
    }

    public static set showFrame(show: boolean) {
        showFrame = show;
        Page.Checkbox.setChecked(FRAME_CONTROL, show);
        callOnChangeObservers();
    }
    public static get showFrame(): boolean {
        return showFrame;
    }

    public static set paddingTop(margin: number) {
        Page.Range.setValue(PADDING_TOP_CONTROL, margin);
        paddingTOP = Page.Range.getValue(PADDING_TOP_CONTROL);
        callOnChangeObservers();
    }
    public static get paddingTop(): number {
        return paddingTOP;
    }

    public static set paddingBottom(margin: number) {
        Page.Range.setValue(PADDING_BOTTOM_CONTROL, margin);
        paddingBottom = Page.Range.getValue(PADDING_BOTTOM_CONTROL);
        callOnChangeObservers();
    }
    public static get paddingBottom(): number {
        return paddingBottom;
    }

    public static set paddingBack(margin: number) {
        Page.Range.setValue(PADDING_BACK_CONTROL, margin);
        paddingBack = Page.Range.getValue(PADDING_BACK_CONTROL);
        callOnChangeObservers();
    }
    public static get paddingBack(): number {
        return paddingBack;
    }

    public static set rotateZ(r: number) {
        Page.Range.setValue(ROTATE_Z_CONTROL, r);
        rotateZ = Page.Range.getValue(ROTATE_Z_CONTROL);
        callOnChangeObservers();
    }
    public static get rotateZ(): number {
        return rotateZ;
    }

    public static set flipVertically(show: boolean) {
        flipVertically = show;
        Page.Checkbox.setChecked(FLIP_VERTICALLY_CONTROL, show);
        callOnChangeObservers();
    }
    public static get flipVertically(): boolean {
        return flipVertically;
    }
}

const css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "canvas:active { cursor: grab; }";
document.body.appendChild(css);

export {
    Parameters,
};
