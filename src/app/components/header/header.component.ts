import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @ViewChild('optionsButton', {static: true}) private optionsButton!: ElementRef;
  @ViewChild('optionsDropdown', {static: true}) private optionsDropdown!: ElementRef;
  private optionsDropped : boolean;
  
  constructor() {
    this.optionsDropped = false;
  }

  onOptionsClicked() : void {
    this.optionsDropdown.nativeElement.style.display = this.optionsDropped ? 'none' : 'block';
    this.optionsDropped = !this.optionsDropped;
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: Event): void {
    if(this.optionsDropped
        && event.target !== this.optionsButton.nativeElement
        && !this.optionsDropdown.nativeElement.contains(event.target))
    {
      this.optionsDropdown.nativeElement.style.display = 'none';
      this.optionsDropped = !this.optionsDropped;
    }
  }
}
