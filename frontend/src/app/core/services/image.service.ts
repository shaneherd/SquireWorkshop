import { Injectable } from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SquireImage} from '../../shared/models/squire-image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  sanitizeImage(image: SquireImage): SafeUrl {
    if (image == null || image.encodedImage == null || image.imageType == null) {
      return null;
    }
    const value = `data:image/${image.imageType};base64,${image.encodedImage}`;
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
