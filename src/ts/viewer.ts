import { gl } from "./gl-utils/gl-canvas";
import GLResource from "./gl-utils/gl-resource";
import Shader from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";
import VBO from "./gl-utils/vbo";

import { Mat4 } from "./gl-utils/matrix/mat4";
import { Vec3 } from "./gl-utils/matrix/vec3";

import { Format, FormatUtils } from "./format-utils";
import { Parameters } from "./parameters";

declare const Canvas: any;

class Viewer extends GLResource {
    private _shaderSkybox: Shader;
    private _shaderSkysphere: Shader;
    private _shaderTinyplanet: Shader;

    private _vbo: VBO;
    private _texture: WebGLTexture;

    private _eyePos: Vec3;
    private _vertical: Vec3;

    private _tmpMatrix: Mat4;
    private _projToWorldMatrix: Mat4;

    private _theta: number;
    private _phi: number;

    private _needToReloadImage: boolean;
    private _needToRedraw: boolean;

    constructor() {
        super(gl);

        this._eyePos = new Vec3(0, 0, 0);
        this._vertical = new Vec3(0, 0, 1);

        this._tmpMatrix = new Mat4();
        this._projToWorldMatrix = new Mat4();

        this.resetThetaPhi();

        this._needToReloadImage = false;
        this._needToRedraw = true;
        const doNeedToRedraw = () => { this._needToRedraw = true; };
        const doNeedToReloadImage = () => {
            doNeedToRedraw();
            this.resetThetaPhi();
            this._needToReloadImage = true;
        };

        Parameters.onInputFormatChangeObservers.push((previous: Format, newOne: Format) => {
            if (previous === Format.Skybox || newOne === Format.Skybox) {
                Canvas.showLoader(true);
                doNeedToReloadImage();
            } else {
                doNeedToRedraw();
            }
        });
        Parameters.onChangeObservers.push(doNeedToRedraw);
        Canvas.Observers.canvasResize.push(doNeedToRedraw);
        Canvas.Observers.mouseDrag.push(doNeedToRedraw);

        this._vbo = VBO.createQuad(gl, -1, -1, 1, 1);

        this.buildShader("_shaderSkysphere", "viewer.vert", "viewerSkysphere.frag");
        this.buildShader("_shaderSkybox", "viewer.vert", "viewerSkybox.frag");
        this.buildShader("_shaderTinyplanet", "viewer.vert", "viewerTinyplanet.frag");

        Canvas.Observers.mouseDrag.push((dX: number, dY: number) => {
            this._phi += Parameters.fov * Canvas.getAspectRatio() * dX;
            this._theta -= Parameters.fov * dY;
            this._theta = Math.min(Math.PI - 0.001, Math.max(0.001, this._theta));
            doNeedToRedraw();
        });

        Parameters.onImageLoadObservers.push((image: HTMLImageElement) => {
            Parameters.inputFormat = FormatUtils.guessFormat(image);
            doNeedToReloadImage();
        });
    }

    public freeGLResources(): void {
        if (this._vbo) {
            this._vbo.freeGLResources();
            this._vbo = null;
        }

        if (this._texture) {
            gl.deleteTexture(this._texture);
            this._texture = null;
        }

        if (this._shaderSkybox) {
            this._shaderSkybox.freeGLResources();
            this._shaderSkybox = null;
        }

        if (this._shaderSkysphere) {
            this._shaderSkysphere.freeGLResources();
            this._shaderSkysphere = null;
        }

        if (this._shaderTinyplanet) {
            this._shaderTinyplanet.freeGLResources();
            this._shaderTinyplanet = null;
        }
    }

    public get texture(): WebGLTexture {
        return this._texture;
    }

    public get needToRedraw(): boolean {
        return this._needToRedraw;
    }

    public update(): void {
        if (this._needToReloadImage) {
            if (Parameters.inputFormat === Format.Skybox) {
                this.splitAndLoadSkybox(Parameters.image);
            } else {
                this.loadTexture(Parameters.image);
            }

            this._needToReloadImage = false;
            Canvas.showLoader(false);
        }
    }

    public draw(): void {
        let shader: Shader;
        if (Parameters.inputFormat === Format.Skybox) {
            shader = this._shaderSkybox;
        } else if (Parameters.inputFormat === Format.Skysphere) {
            shader = this._shaderSkysphere;
        } else {
            shader = this._shaderTinyplanet;
        }

        if (shader) {
            this.recomputeMatrices();

            /* tslint:disable:no-string-literal */
            shader.u["uProjToWorld"].value = this._projToWorldMatrix.val;
            shader.u["uTexture"].value = this._texture;
            shader.u["uPaddingTop"].value = Parameters.paddingTop;
            shader.u["uPaddingBottom"].value = Parameters.paddingBottom;
            shader.u["uPaddingBack"].value = Parameters.paddingBack;
            shader.u["uRotateZ"].value = Parameters.rotateZ;
            shader.u["uFlipVertically"].value = Parameters.flipVertically ? -1 : 1;
            shader.u["uShowFrame"].value = Parameters.showFrame ? 1 : 0;
            /* tslint:enable:no-string-literal */

            shader.use();
            shader.bindUniformsAndAttributes();

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        this._needToRedraw = false;
    }

    private resetThetaPhi(): void {
        this._theta = 0.5 * Math.PI;
        this._phi = 0;
        this._needToRedraw = true;
    }

    private loadTexture(image: HTMLImageElement): void {
        gl.deleteTexture(this._texture);
        this._texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    private splitAndLoadSkybox(image: HTMLImageElement): void {
        function chooseUpperPowerOfTwo(n: number): number {
            return Math.pow(2, Math.ceil(Math.log(n) * Math.LOG2E));
        }

        const side = chooseUpperPowerOfTwo(Math.floor(Math.max(image.width / 4, image.height / 3)));

        gl.deleteTexture(this._texture);
        this._texture = gl.createTexture();

        /* Use a temporary canvas to split the image into each face of the cube */
        const context = document.createElement("canvas").getContext("2d");
        context.canvas.width = side;
        context.canvas.height = side;

        const sidesStyles = [
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, position: { x: 2, y: 1 }, rotation: 0.5 * Math.PI },  // front
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, position: { x: 0, y: 1 }, rotation: -0.5 * Math.PI }, // back
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, position: { x: 1, y: 1 }, rotation: -Math.PI },       // left
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, position: { x: 3, y: 1 }, rotation: 0 },              // right
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, position: { x: 1, y: 0 }, rotation: Math.PI },        // top
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, position: { x: 1, y: 2 }, rotation: 0 },              // bottom
        ];

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._texture);

        context.translate(side, 0);
        context.scale(-1, 1);

        const sourceWidth = image.width / 4;
        const sourceHeight = image.height / 3;
        for (const sideStyle of sidesStyles) {
            context.translate(0.5 * side, 0.5 * side);
            context.rotate(sideStyle.rotation);
            context.translate(-0.5 * side, -0.5 * side);

            context.drawImage(image,
                sideStyle.position.x * sourceWidth, sideStyle.position.y * sourceHeight,
                sourceWidth, sourceHeight,
                0, 0, side, side);

            gl.texImage2D(sideStyle.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, context.canvas);

            context.translate(0.5 * side, 0.5 * side);
            context.rotate(-sideStyle.rotation);
            context.translate(-0.5 * side, -0.5 * side);
        }

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    private buildShader(name: string, vertex: string, fragment: string): void {
        ShaderManager.buildShader(
            {
                fragmentFilename: fragment,
                vertexFilename: vertex,
            },
            (shader) => {
                if (shader !== null) {
                    /* tslint:disable:no-string-literal */
                    this[name] = shader;
                    this[name].a["aCorner"].VBO = this._vbo;
                    /* tslint:enable:no-string-literal */
                    this._needToRedraw = true;
                }
            });
    }

    private recomputeMatrices(): void {
        const lookAt = new Vec3(
            Math.sin(this._theta) * Math.cos(this._phi),
            Math.sin(this._theta) * Math.sin(this._phi),
            Math.cos(this._theta),
        );
        this._projToWorldMatrix.lookAt(this._eyePos, lookAt, this._vertical);
        this._projToWorldMatrix.invert();

        const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this._tmpMatrix.perspectiveInverse(Parameters.fov, aspectRatio, 0.1, Infinity);

        // no need to remove translations from invViewMatrix since camera is on world (0,0,0)
        // this._invViewMatrix[3*4 + 0] = 0;
        // this._invViewMatrix[3*4 + 1] = 0;
        // this._invViewMatrix[3*4 + 2] = 0;
        this._projToWorldMatrix.multiplyRight(this._tmpMatrix);
    }
}

export default Viewer;
