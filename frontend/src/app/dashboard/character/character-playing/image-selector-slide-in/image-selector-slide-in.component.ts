import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {SquireImage} from '../../../../shared/models/squire-image';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification.service';

@Component({
  selector: 'app-image-selector-slide-in',
  templateUrl: './image-selector-slide-in.component.html',
  styleUrls: ['./image-selector-slide-in.component.scss']
})
export class ImageSelectorSlideInComponent {
  @Input() playerCharacter: PlayerCharacter;
  @Input() sanitizedImage: SafeUrl = null;
  @Output() save = new EventEmitter<SquireImage>();
  @Output() delete = new EventEmitter();
  @Output() close = new EventEmitter();

  loading = false;
  selectedImage: File = null;
  preview: any = null;

  constructor(
    private characterService: CharacterService,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) { }

  handleFileInput(files: FileList): void {
    this.selectedImage = files.item(0);

    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.preview = event.target.result;
    };
    reader.readAsDataURL(this.selectedImage);
  }

  saveClick(): void {
    if (this.selectedImage != null) {
      this.loading = true;
      this.characterService.uploadImage(this.playerCharacter, this.selectedImage).then((image: SquireImage) => {
        this.playerCharacter.image = image;
        this.save.emit(image);
        this.loading = false;
      }, () => {
        const translatedMessage = this.translate.instant('CharacterImage.Upload.Error');
        this.notificationService.error(translatedMessage);
        this.loading = false;
      });
    } else {
      this.close.emit();
    }
  }

  deleteClick(): void {
    this.loading = true;
    this.characterService.deleteImage(this.playerCharacter).then(() => {
      this.sanitizedImage = null;
      this.delete.emit();
      this.loading = false;
    }, () => {
      const translatedMessage = this.translate.instant('CharacterImage.Delete.Error');
      this.notificationService.error(translatedMessage);
      this.loading = false;
    });
  }

  closeClick(): void {
    this.close.emit();
  }
}
