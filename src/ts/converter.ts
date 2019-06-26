import { gl } from "./gl-utils/gl-canvas";
import GLResource from "./gl-utils/gl-resource";
import Shader from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";
import VBO from "./gl-utils/vbo";

import { Format } from "./format-utils";
import { Parameters } from "./parameters";

class Converter extends GLResource {
    private _shaderBoxToBox: Shader;
    private _shaderBoxToPlanet: Shader;
    private _shaderBoxToSphere: Shader;

    private _shaderSphereToBox: Shader;
    private _shaderSphereToPlanet: Shader;
    private _shaderSphereToSphere: Shader;

    private _shaderPlanetToBox: Shader;
    private _shaderPlanetToPlanet: Shader;
    private _shaderPlanetToSphere: Shader;

    private _vbo: VBO;

    constructor() {
        super(gl);

        this._vbo = VBO.createQuad(gl, -1, -1, 1, 1);

        this.buildShader("_shaderBoxToBox",         "converter.vert", "converterBoxToBox.frag");
        this.buildShader("_shaderBoxToPlanet",      "converter.vert", "converterBoxToPlanet.frag");
        this.buildShader("_shaderBoxToSphere",      "converter.vert", "converterBoxToSphere.frag");

        this.buildShader("_shaderSphereToBox",      "converter.vert", "converterSphereToBox.frag");
        this.buildShader("_shaderSphereToPlanet",   "converter.vert", "converterSphereToPlanet.frag");
        this.buildShader("_shaderSphereToSphere",   "converter.vert", "converterSphereToSphere.frag");

        this.buildShader("_shaderPlanetToBox",      "converter.vert", "converterPlanetToBox.frag");
        this.buildShader("_shaderPlanetToPlanet",   "converter.vert", "converterPlanetToPlanet.frag");
        this.buildShader("_shaderPlanetToSphere",   "converter.vert", "converterPlanetToSphere.frag");
    }

    public freeGLResources(): void {
        if (this._vbo) {
            this._vbo.freeGLResources();
            this._vbo = null;
        }

        this.deleteShader("_shaderBoxToBox");
        this.deleteShader("_shaderBoxToPlanet");
        this.deleteShader("_shaderBoxToSphere");

        this.deleteShader("_shaderSphereToBox");
        this.deleteShader("_shaderSphereToPlanet");
        this.deleteShader("_shaderSphereToSphere");

        this.deleteShader("_shaderPlanetToBox");
        this.deleteShader("_shaderPlanetToPlanet");
        this.deleteShader("_shaderPlanetToSphere");
    }

    public draw(texture: WebGLTexture): void {
        const shader = this.getShader(Parameters.inputFormat, Parameters.outputFormat);

        if (shader && texture) {
            /* tslint:disable:no-string-literal */
            shader.u["uTexture"].value = texture;
            shader.u["uPaddingTop"].value = Parameters.paddingTop;
            shader.u["uPaddingBottom"].value = Parameters.paddingBottom;
            shader.u["uPaddingBack"].value = Parameters.paddingBack;
            shader.u["uRotateZ"].value = Parameters.rotateZ;
            shader.u["uFlipVertically"].value = Parameters.flipVertically ? -1 : 1;
            /* tslint:enable:no-string-literal */

            shader.use();
            shader.bindUniformsAndAttributes();

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }

    private deleteShader(name: string): void {
        /* tslint:disable:no-string-literal */
        if (this[name]) {
            this[name].freeGLResources();
            this[name] = null;
        }
        /* tslint:enable:no-string-literal */
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
                }
            });
    }

    private getShader(inputFormat: Format, outputFormat: Format): Shader {
        if (inputFormat === Format.Skybox) {
            if (outputFormat === Format.Skybox) {
                return this._shaderBoxToBox;
            } else if (outputFormat === Format.Skysphere) {
                return this._shaderBoxToSphere;
            } else /* if (outputFormat === Format.Tinyplanet) */ {
                return this._shaderBoxToPlanet;
            }
        } else if (inputFormat === Format.Skysphere) {
            if (outputFormat === Format.Skybox) {
                return this._shaderSphereToBox;
            } else if (outputFormat === Format.Skysphere) {
                return this._shaderSphereToSphere;
            } else /* if (outputFormat === Format.Tinyplanet) */ {
                return this._shaderSphereToPlanet;
            }
        } else if (inputFormat === Format.Tinyplanet) {
            if (outputFormat === Format.Skybox) {
                return this._shaderPlanetToBox;
            } else if (outputFormat === Format.Skysphere) {
                return this._shaderPlanetToSphere;
            } else /* if (outputFormat === Format.Tinyplanet) */ {
                return this._shaderPlanetToPlanet;
            }
        }
    }
}

export default Converter;
