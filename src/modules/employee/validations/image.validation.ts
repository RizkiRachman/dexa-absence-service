import {ErrorDetail} from '@/shared/dtos/dto';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'];
const ALLOWED_ENCODINGS = ['base64'];
const MAX_SIZE_BYTES = 1024 * 1024; // 1M

export class ImageValidation {
    private readonly image: string;
    readonly field: string;

    constructor(image: string, field = 'email') {
        this.image = image;
        this.field = field;
    }

    validate(): ErrorDetail | null {
        const regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9+.-]+);([a-zA-Z0-9]+),([A-Za-z0-9+/=]+)$/;
        const match = this.image.match(regex);

        if (!match) {
            return {field: this.field, message: 'Image format is invalid'};
        }

        const mimeType = match[1];   // e.g. image/png
        const encoding = match[2];   // e.g. base64
        const data = match[3];   // actual base64 string

        // Check encoding type
        if (!ALLOWED_ENCODINGS.includes(encoding)) {
            return {
                field: this.field,
                message: `Encoding "${encoding}" is not allowed. Only base64 is accepted.`
            };
        }

        // Check MIME type
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return {
                field: this.field,
                message: `MIME type "${mimeType}" is not allowed. Only PNG and JPG are accepted.`
            };
        }

        // Check base64 data is not empty
        if (!data || data.length === 0) {
            return {
                field: this.field,
                message: 'Image data is empty.'
            };
        }

        if (data.length > MAX_SIZE_BYTES) {
            return {
                field: this.field,
                message: `Image size exceeds the limit of "${MAX_SIZE_BYTES}" bytes.`
            };
        }

        return null;
    }

    static validate(email: string, field = 'email'): ErrorDetail | null {
        return new ImageValidation(email, field).validate();
    }

}
