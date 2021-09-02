import { IAppLogger } from "./app-logger";
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

export interface IImageCompressor {
    compressImage(image);
}

export class ImageCompressor {
    constructor(private logger: IAppLogger) {

    }

    public async compressImage(image) {
        try {
            const files = await imagemin.buffer(image, {
                plugins: [
                    imageminMozjpeg({ quality: 30 }),
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            });

            return files;
        } catch (error) {
            this.logger.error(error);
            this.logger.log(error);
            return null
        }
    }
}