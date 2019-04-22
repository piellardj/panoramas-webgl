import Converter from "./converter";
import { Format, FormatUtils } from "./format-utils";
import * as GlCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";
import { Parameters } from "./parameters";
import Viewer from "./viewer";

declare const Canvas: any;
declare const FileControl: any;

function main() {
    function resetEditControls() {
        Parameters.paddingTop = 0;
        Parameters.paddingBottom = 0;
        Parameters.paddingBack = 0;
        Parameters.rotateZ = 0;
        Parameters.flipVertically = false;
    }

    Canvas.showLoader(true);

    Parameters.onImageLoadObservers.push(resetEditControls);

    Parameters.image = new Image();
    Parameters.image.src = "./images/skybox.jpg";

    Parameters.inputFormat = Format.Skybox;

    Parameters.outputFormat = Format.Skysphere;
    Parameters.previewOutput = false;

    Parameters.fov = 70 * Math.PI / 180;
    Parameters.showFrame = false;
    resetEditControls();

    const glParams = {
        alpha: false,
        preserveDrawingBuffer: true,
    };
    if (!GlCanvas.initGL(glParams)) {
        return;
    }

    const viewer = new Viewer();
    const converter = new Converter();

    let forceRedraw = false;

    FileControl.addDownloadObserver("file-download-id", () => {
        const idealWidth = Parameters.image.width * Parameters.outputPercentage;
        const width = Math.pow(2, Math.floor(Math.log(idealWidth) * Math.LOG2E));
        const height = width / FormatUtils.ratio(Parameters.outputFormat);

        const canvas = Canvas.getCanvas() as HTMLCanvasElement;

        /* Update CSS to allow the canvas to have the correct size */
        canvas.style.position = "absolute";
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = width;
        canvas.height = height;

        GlCanvas.adjustSize();
        Viewport.setFullCanvas(gl);

        /* tslint:disable:no-bitwise */
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        converter.draw(viewer.texture);
        /* tslint:disable:no-bitwise */
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        converter.draw(viewer.texture);
        /* tslint:enable:no-bitwise */

        function restoreCanvas() {
            /* Restore CSS */
            canvas.style.position = "";
            canvas.style.width = "";
            canvas.style.height = "";

            forceRedraw = true;
        }

        if ((canvas as any).msToBlob) { // for IE
            const blob = (canvas as any).msToBlob();
            window.navigator.msSaveBlob(blob, "image.png");
            restoreCanvas();
        } else {
            canvas.toBlob((blob) => {
                const link = document.createElement("a");
                link.download = "image.png";
                link.href = URL.createObjectURL(blob);
                link.click();

                restoreCanvas();
            });
        }
    });

    const previewViewport = new Viewport(0, 0, 1, 1);

    function mainLoop() {
        viewer.update();

        if (viewer.needToRedraw || forceRedraw) {
            GlCanvas.adjustSize();
            Viewport.setFullCanvas(gl);

            /* tslint:disable:no-bitwise */
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            /* tslint:enable:no-bitwise */

            viewer.draw();

            if (Parameters.previewOutput) {
                previewViewport.width = 0.3 * gl.drawingBufferWidth;
                previewViewport.height = previewViewport.width / FormatUtils.ratio(Parameters.outputFormat);
                previewViewport.set(gl);
                converter.draw(viewer.texture);
            }

            forceRedraw = false;
        }

        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);
}

main();
