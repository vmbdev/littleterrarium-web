import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { ThemeService } from '@services/theme.service';

export type BoxIconType = 'regular' | 'solid' | 'logo';
export type BoxIconSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'box-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box-icon.component.html',
  styleUrl: './box-icon.component.scss',
})
export class BoxIconComponent {
  @Input() type: BoxIconType = 'regular';
  @Input({ required: true }) name?: string;
  @Input() color?: string;
  @Input() size?: BoxIconSize;
  @Input({ transform: numberAttribute }) rotate?: 90 | 180 | 270;
  @Input() flip?: 'horizontal' | 'vertical';
  @Input() border?: 'square' | 'circle';
  @Input() animation?:
    | 'spin'
    | 'tada'
    | 'flashing'
    | 'burst'
    | 'fade-left'
    | 'fade-right';
  @Input() pull?: 'left' | 'right';
  @Input({ transform: booleanAttribute }) hover: boolean = false;
  @Input({ transform: booleanAttribute }) fixedWidth: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) hidden: boolean = false;
  @Input({ transform: booleanAttribute }) infoProperty: boolean = false;
  @Output() click: EventEmitter<void> = new EventEmitter();

  classList: string[] = [];
  clickHasHandler: boolean = false;

  constructor(public readonly themeService: ThemeService) {}

  ngOnChanges(): void {
    this.generateClassNames();
  }

  generateClassNames(): void {
    this.classList = ['bx'];
    this.classList.push(this.getTypeClass());

    if (this.border) {
      this.classList.push(
        `bx-border${this.border == 'circle' ? '-circle' : ''}`
      );
    }
    if (this.rotate) this.classList.push(`bx-rotate-${this.rotate}`);
    if (this.size) this.classList.push(`bx-${this.size}`);
    if (this.flip) this.classList.push(`bx-flip-${this.flip}`);
    if (this.fixedWidth) this.classList.push('bx-fw');
    if (this.pull) this.classList.push(`bx-pull-${this.pull}`);
    if (this.animation) {
      this.classList.push(`bx-${this.animation}${this.hover ? '-hover' : ''}`);
    }
    if (this.click.observed) this.classList.push('cbx--clickable');
    if (this.infoProperty) {
      if (!this.size) this.classList.push('bx-lg');
      if (!this.fixedWidth) this.classList.push('bx-fw');
    }
  }

  getTypeClass(): string {
    let mod;

    switch (this.type) {
      case 'solid':
        mod = 's';
        break;
      case 'logo':
        mod = 'l';
        break;
      default:
        mod = '';
        break;
    }

    return `bx${mod}-${this.name}`;
  }

  handleClick(event: Event): void {
    if (this.click.observed) event.stopPropagation();

    if (!this.disabled) this.click.emit();
  }
}
