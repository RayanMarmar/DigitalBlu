import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Mouse} from "../../models/mouse";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent  implements AfterViewInit{
// its important myCanvas matches the variable name in the template
  @ViewChild('myCanvas', {static: true}) private canvas!: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D | null = null;
  private mouse : Mouse;
  private canvasRect : DOMRect | null = null;

  constructor() {
    this.mouse = new Mouse();
  }
  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d');
    this.setCanvasSize();
    this.canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    this.mouse.setCanvasRectFromDomRect(this.canvasRect);
  }
  drawPoint() : void {
    if (this.context) {
      this.context.fillRect(this.mouse.clickedCoordinates!.x - 2, this.mouse.clickedCoordinates!.y - 2,5,5);
    } else {
      console.error('Context is null.');
    }
  }

  onMouseDown(event: MouseEvent) : void {
    this.mouse.mouseDown(event);
    this.drawPoint();
  }

  drawLine() : void {
    if (this.context) {
      this.context.clearRect(0,0,this.canvasRect!.width,this.canvasRect!.height);
      this.context.beginPath()
      this.context.moveTo(this.mouse.clickedCoordinates!.x, this.mouse.clickedCoordinates!.y);
      this.context.lineTo(this.mouse.currentCoordinates!.x, this.mouse.currentCoordinates!.y);
      this.context.stroke();
    } else {
      console.error('Context is null.');
    }
  }
  onMouseMove(event: MouseEvent) : void {
    if(!this.mouse.isPressed)
      return;
    this.mouse.mouseMove(event);
    this.drawLine();
  }

  onMouseUp(event: MouseEvent) : void {
    this.mouse.mouseUp(event)
  }
  setCanvasSize(): void {
    if (this.context) {
      // Set canvas dimensions to match window size
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;
    }
  }
}
