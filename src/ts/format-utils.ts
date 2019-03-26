enum Format {
    Skybox = "skybox",
    Skysphere = "skysphere",
    Tinyplanet = "tinyplanet",
}

class FormatUtils {
    public static guessFormat(image: HTMLImageElement): Format {
        if (FormatUtils.mayBeSkybox(image)) {
            return Format.Skybox;
        }

        const ratio = image.width / image.height;
        if (Math.abs(ratio - 1) < 0.1) {
            return Format.Tinyplanet;
        }

        return Format.Skysphere;
    }

    public static parseString(str: string): Format {
        if (str === Format.Skybox) {
            return Format.Skybox;
        } else if (str === Format.Tinyplanet) {
            return Format.Tinyplanet;
        } else {
            return Format.Skysphere;
        }
    }

    public static ratio(format: Format): number {
        if (format === Format.Skybox) {
            return 4 / 3;
        } else if (format === Format.Skysphere) {
            return 2;
        } else /* if (format === Format.Tinyplanet) */ {
            return 1;
        }
    }

    private static mayBeSkybox(image: HTMLImageElement): boolean {
        const context = document.createElement("canvas").getContext("2d");
        context.canvas.width = 8;
        context.canvas.height = 6;
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);

        const testedPixels = [
            {x: 0, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0},   // top
            {x: 0, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5},  // bottom
        ];

        const reference = context.getImageData(testedPixels[0].x, testedPixels[0].y, 1, 1).data;
        for (const tested of testedPixels) {
            const sample = context.getImageData(tested.x, tested.y, 1, 1).data;

            for (let i = 0; i < 4; ++i) {
                if (sample[i] !== reference[i]) {
                    return false;
                }
            }
        }

        return true;
    }

    private constructor() { }
}

export {
    Format,
    FormatUtils,
};
