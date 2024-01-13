import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent  implements AfterViewInit{
// its important myCanvas matches the variable name in the template
  @ViewChild('myCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | null = null;

  constructor() {
  }
  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d');
    this.setCanvasSize();
  }
  drawPoint(event: MouseEvent) : void {
    const rect : DOMRect = this.canvas.nativeElement.getBoundingClientRect();
    let x :number = event.clientX - rect.left;
    let y :number = event.clientY - rect.top;
    if (this.context) {
      this.context.fillRect(x - 2, y - 2,5,5);
    } else {
      console.error('Context is null.');
    }
  }

  setCanvasSize(): void {
    if (this.context) {
      // Set canvas dimensions to match window size
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;
    }
  }
}
