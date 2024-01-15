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
  oldX : number = 0;
  oldY : number = 0;
  mouseClicked : boolean = false;

  constructor() {
  }
  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d');
    this.setCanvasSize();
  }
  drawPoint(event: MouseEvent) : void {
    const rect : DOMRect = this.canvas.nativeElement.getBoundingClientRect();
    this.oldX = event.clientX - rect.left;
    this.oldY = event.clientY - rect.top;
    this.mouseClicked = true;
    if (this.context) {
      this.context.fillRect(this.oldX - 2, this.oldY - 2,5,5);
    } else {
      console.error('Context is null.');
    }
  }

  drawLine(event: MouseEvent) : void {
    if(!this.mouseClicked)
      return;
    const rect : DOMRect = this.canvas.nativeElement.getBoundingClientRect();
    let x :number = event.clientX - rect.left;
    let y :number = event.clientY - rect.top;
    if (this.context) {
      this.context.clearRect(0,0,rect.width,rect.height);
      this.context.beginPath()
      this.context.moveTo(this.oldX, this.oldY);
      this.context.lineTo(x, y);
      this.context.stroke();
    } else {
      console.error('Context is null.');
    }
  }

  onMouseUp() : void {
    this.mouseClicked = false;
  }
  setCanvasSize(): void {
    if (this.context) {
      // Set canvas dimensions to match window size
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;
    }
  }
}
