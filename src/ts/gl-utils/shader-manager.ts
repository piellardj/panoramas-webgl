import { gl } from "./gl-canvas";
import Shader from "./shader";
import * as ShaderSources from "./shader-sources";

type RegisterCallback = (success: boolean, shader: Shader | null) => void;

interface IShaderInfos {
    fragmentFilename: string;
    vertexFilename: string;
}

interface ICachedShader {
    shader: Shader;
    infos: IShaderInfos;
    pending: boolean;
    failed: boolean;
    callbacks: RegisterCallback[];
}

const cachedShaders: { [id: string]: ICachedShader} = {};

function getShader(name: string): Shader | null {
    return cachedShaders[name].shader;
}

type BuildCallback = (builtShader: Shader | null) => void;

function buildShader(infos: IShaderInfos, callback: BuildCallback) {
    let sourcesPending = 2;
    let sourcesFailed = 0;

    function loadedSource(success: boolean) {
        sourcesPending--;
        if (!success) {
            sourcesFailed++;
        }

        if (sourcesPending === 0) {
            let shader = null;

            if (sourcesFailed === 0) {
                const vert = ShaderSources.getSource(infos.vertexFilename);
                const frag = ShaderSources.getSource(infos.fragmentFilename);
                shader = new Shader(gl, vert, frag);
            }

            callback(shader);
        }
    }

    ShaderSources.loadSource(infos.vertexFilename, loadedSource);
    ShaderSources.loadSource(infos.fragmentFilename, loadedSource);
}

function registerShader(name: string, infos: IShaderInfos, callback: RegisterCallback): void {
    function callAndClearCallbacks(cached: ICachedShader) {
        for (const cachedCallback of cached.callbacks) {
            cachedCallback(!cached.failed, cached.shader);
        }

        cached.callbacks = [];
    }

    if (typeof cachedShaders[name] === "undefined") {
        cachedShaders[name] = {
            callbacks: [callback],
            failed: false,
            infos,
            pending: true,
            shader: null,
        };
        const cached = cachedShaders[name];

        buildShader(infos, (builtShader) => {
            cached.pending = false;
            cached.failed = builtShader === null;
            cached.shader = builtShader;

            callAndClearCallbacks(cached);
        });
    } else {
        const cached = cachedShaders[name];

        if (cached.pending === true) {
            cached.callbacks.push(callback);
        } else {
            callAndClearCallbacks(cached);
        }
    }
}

function deleteShader(name: string) {
    if (cachedShaders[name]) {
        if (cachedShaders[name].shader) {
            cachedShaders[name].shader.freeGLResources();
        }
        delete cachedShaders[name];
    }
}

export {
    buildShader,
    getShader,
    IShaderInfos,
    registerShader,
    deleteShader,
};
