import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.css']
})
export class SuccessPopupComponent {
  @Input() show = false;
  @Input() title = 'Success!';
  @Input() message = 'Operation completed successfully.';

  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.show && event.key === 'Escape') {
      this.closePopup();
    }
  }

  closePopup() {
    this.close.emit();
  }

  onOverlayClick() {
    this.closePopup();
  }

  onPopupClick(event: Event) {
    event.stopPropagation();
  }
}
