// is_base_64_image.util.ts
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isBase64Image', async: false })
export class IsBase64Image implements ValidatorConstraintInterface {
  validate(text: string) {
    const regex = /data:image\/[bmp,gif,ico,jpg,png,svg,webp,x\-icon,svg+xml]+;base64,[a-zA-Z0-9,+,/]+={0,2}/gm;
    return regex.test(text);
  }

  defaultMessage() {
    return 'image must be a valid base64 encoded image';
  }
}