import { Format, FormatUtils } from "./format-utils";

declare const Canvas: any;
declare const Checkbox: any;
declare const Demopage: any;
declare const FileControl: any;
declare const Range: any;
declare const Tabs: any;

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
FileControl.addUploadObserver(FILE_UPLOAD_CONTROL, (files: FileList) => {
    Canvas.showLoader(true);

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
Tabs.addObserver(INPUT_FORMAT_CONTROL, (values: string[]) => {
    const previous = inputFormat;
    inputFormat = FormatUtils.parseString(values[0]);

    for (const callback of onInputFormatChangeObservers) {
        callback(previous, inputFormat);
    }
});

let outputFormat: Format;
const OUTPUT_FORMAT_CONTROL = "output-format";
Tabs.addObserver(OUTPUT_FORMAT_CONTROL, (values: string[]) => {
    outputFormat = FormatUtils.parseString(values[0]);
    callOnChangeObservers();
});

let outputPreview: boolean;
const OUPUT_PREVIEW_CONTROL = "output-preview-id";
Checkbox.addObserver(OUPUT_PREVIEW_CONTROL, (checked: boolean) => {
    outputPreview = checked;
    callOnChangeObservers();
});

let fov: number;
const FOV_CONTROL = "fov-range-id";
Range.addObserver(FOV_CONTROL, (newFov: number) => {
    fov = Math.PI / 180 * newFov;
    callOnChangeObservers();
});

let showFrame: boolean;
const FRAME_CONTROL = "frame-checkbox-id";
Checkbox.addObserver(FRAME_CONTROL, (checked: boolean) => {
    showFrame = checked;
    callOnChangeObservers();
});

let paddingTOP: number;
const PADDING_TOP_CONTROL = "padding-top-range-id";
Range.addObserver(PADDING_TOP_CONTROL, (margin: number) => {
    paddingTOP = margin;
    callOnChangeObservers();
});

let paddingBottom: number;
const PADDING_BOTTOM_CONTROL = "padding-bottom-range-id";
Range.addObserver(PADDING_BOTTOM_CONTROL, (margin: number) => {
    paddingBottom = margin;
    callOnChangeObservers();
});

let paddingBack: number;
const PADDING_BACK_CONTROL = "padding-back-range-id";
Range.addObserver(PADDING_BACK_CONTROL, (margin: number) => {
    paddingBack = margin;
    callOnChangeObservers();
});

let rotateZ: number;
const ROTATE_Z_CONTROL = "rotate-z-range-id";
Range.addObserver(ROTATE_Z_CONTROL, (r: number) => {
    rotateZ = r;
    callOnChangeObservers();
});

let flipVertically: boolean;
const FLIP_VERTICALLY_CONTROL = "flip-vertically-checkbox-id";
Checkbox.addObserver(FLIP_VERTICALLY_CONTROL, (checked: boolean) => {
    flipVertically = checked;
    callOnChangeObservers();
});

Canvas.Observers.mouseWheel.push((delta: number) => {
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
            Demopage.removeErrorMessage(ERROR_MESSAGE_ID);
            for (const callback of onImageLoadObservers) {
                callback(image);
            }

            callOnChangeObservers();
        });

        image.addEventListener("error", () => {
            Demopage.setErrorMessage(ERROR_MESSAGE_ID, "The image could not be loaded.");
            Canvas.showLoader(false);
            console.error("Image could not be loaded.");
        });
    }
    public static get image(): HTMLImageElement {
        return image;
    }

    public static set inputFormat(value: Format) {
        inputFormat = value;
        Tabs.setValues(INPUT_FORMAT_CONTROL, [value]);
        callOnChangeObservers();
    }
    public static get inputFormat(): Format {
        return inputFormat;
    }

    public static set previewOutput(show: boolean) {
        outputPreview = show;
        Checkbox.setChecked(OUPUT_PREVIEW_CONTROL, show);
        callOnChangeObservers();
    }
    public static get previewOutput(): boolean {
        return outputPreview;
    }

    public static set outputFormat(value: Format) {
        outputFormat = value;
        Tabs.setValues(OUTPUT_FORMAT_CONTROL, [value]);
        callOnChangeObservers();
    }
    public static get outputFormat(): Format {
        return outputFormat;
    }

    public static get outputPercentage(): number {
        return +Tabs.getValues("output-quality")[0] / 100;
    }

    public static set fov(value: number) {
        Range.setValue(FOV_CONTROL, value * 180 / Math.PI);
        fov = Range.getValue(FOV_CONTROL) * Math.PI / 180;
        callOnChangeObservers();
    }
    public static get fov(): number {
        return fov;
    }

    public static set showFrame(show: boolean) {
        showFrame = show;
        Checkbox.setChecked(FRAME_CONTROL, show);
        callOnChangeObservers();
    }
    public static get showFrame(): boolean {
        return showFrame;
    }

    public static set paddingTop(margin: number) {
        Range.setValue(PADDING_TOP_CONTROL, margin);
        paddingTOP = Range.getValue(PADDING_TOP_CONTROL);
        callOnChangeObservers();
    }
    public static get paddingTop(): number {
        return paddingTOP;
    }

    public static set paddingBottom(margin: number) {
        Range.setValue(PADDING_BOTTOM_CONTROL, margin);
        paddingBottom = Range.getValue(PADDING_BOTTOM_CONTROL);
        callOnChangeObservers();
    }
    public static get paddingBottom(): number {
        return paddingBottom;
    }

    public static set paddingBack(margin: number) {
        Range.setValue(PADDING_BACK_CONTROL, margin);
        paddingBack = Range.getValue(PADDING_BACK_CONTROL);
        callOnChangeObservers();
    }
    public static get paddingBack(): number {
        return paddingBack;
    }

    public static set rotateZ(r: number) {
        Range.setValue(ROTATE_Z_CONTROL, r);
        rotateZ = Range.getValue(ROTATE_Z_CONTROL);
        callOnChangeObservers();
    }
    public static get rotateZ(): number {
        return rotateZ;
    }

    public static set flipVertically(show: boolean) {
        flipVertically = show;
        Checkbox.setChecked(FLIP_VERTICALLY_CONTROL, show);
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
