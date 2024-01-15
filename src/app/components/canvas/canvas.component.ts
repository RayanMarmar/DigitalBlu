import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Mouse} from "../../models/mouse";
import {Wall} from "../../models/wall";

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

  onMouseDown(event: MouseEvent) : void {
    this.mouse.mouseDown(event);
    this.drawPoint();
  }

  onMouseMove(event: MouseEvent) : void {
    if(!this.mouse.isPressed)
      return;
    this.mouse.mouseMove(event);
    this.drawWall(new Wall(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!));
  }

  onMouseUp(event: MouseEvent) : void {
    this.mouse.mouseUp(event)
  }

  drawWall(wall: Wall) : void {
    if (this.context) {
      this.context.clearRect(0,0,this.canvasRect!.width,this.canvasRect!.height);
      this.context.beginPath()
      this.context.moveTo(wall.firstPoint.x, wall.firstPoint.y);
      this.context.lineTo(wall.secondPoint.x, wall.secondPoint.y);
      this.context.stroke();
    } else {
      console.error('Context is null.');
    }
  }

  drawPoint() : void {
    if (this.context) {
      this.context.fillRect(this.mouse.clickedCoordinates!.x - 2, this.mouse.clickedCoordinates!.y - 2,5,5);
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
