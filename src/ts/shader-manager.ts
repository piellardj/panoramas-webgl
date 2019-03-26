import { gl } from "./gl-canvas";
import Shader from "./gl-utils/shader";
import * as ShaderSources from "./shader-sources";

interface IShaderInfos {
    fragmentFilename: string;
    vertexFilename: string;
}

interface ICachedShader {
    shader: Shader;
    infos: IShaderInfos;
}

const cachedShaders: { [id: string]: ICachedShader} = {};

function getShader(name: string): Shader | null {
    if (!cachedShaders[name]) {
        return null;
    }
    return cachedShaders[name].shader;
}

type BuildShader = (builtShader: Shader | null) => void;

function buildShader(infos: IShaderInfos, callback: BuildShader) {
    const filenames = [
        infos.vertexFilename,
        infos.fragmentFilename,
    ];

    ShaderSources.loadSources(filenames, (success: boolean) => {
        if (success) {
            const vert = ShaderSources.getSource(infos.vertexFilename);
            const frag = ShaderSources.getSource(infos.fragmentFilename);

            const shader = new Shader(gl, vert, frag);
            callback(shader);
        } else {
            console.error("Failed to load '" + filenames.join(", ") + "' shaders.");
            callback(null);
        }
    });
}

type RegisterCallback = (success: boolean, shader: Shader | null) => void;
function registerShader(name: string, infos: IShaderInfos, callback: RegisterCallback): void {
    if (cachedShaders[name]) {
        console.warn("Shader '" + name + "' already registered.");
        callback(true, cachedShaders[name].shader);
        return;
    }

    buildShader(infos, (builtShader) => {
        if (builtShader != null) {
            cachedShaders[name] = {
                infos,
                shader: builtShader,
            };
        }
    });
}

function unregisterShader(name: string) {
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
    registerShader,
    IShaderInfos,
    unregisterShader,
};
