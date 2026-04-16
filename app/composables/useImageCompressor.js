import Compressor from "compressorjs"

export const useImageCompressor = () => {
    const compressorImage = (file, options = {}) => {
        return new Promise((resolve, reject) => {
            new Compressor(file, {
                ...options,
                success(result) {
                    resolve(result);
                },
                error(err) {
                    reject(err);
                },
            });
        });
    }

    const getImageDimensions = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Не удалось загрузить изображение'));
            };
            img.src = url;
        });
    }

    const getImageInfo = async (file) => {
        const dimensions = await getImageDimensions(file);
        return {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: new Date(file.lastModified),
            width: dimensions.width,
            height: dimensions.height,
        };
    }

    const imageCompress = async (file) => {
        if (!file) return null;

        const info = await getImageInfo(file);
        const newWidth = Math.floor(info.width / 1.6);
        const newHeight = Math.floor(info.height / 1.6);

        return await compressorImage(file, {
            quality: 0.6,
            width: newWidth,
            height: newHeight,
            mimeType: 'image/jpeg',
        })
    }

    return {
        imageCompress
    }
}