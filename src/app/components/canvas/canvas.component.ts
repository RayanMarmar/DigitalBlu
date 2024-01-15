import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Mouse} from "../../models/mouse";
import {Wall} from "../../models/wall";
import {Point} from "../../models/point";

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
  private wallsList : Wall[];
  private pointsList : Point[];

  constructor() {
    this.mouse = new Mouse();
    this.wallsList = [];
    this.pointsList = [];
  }
  ngAfterViewInit(): void {
    this.context = this.canvas?.nativeElement.getContext('2d');
    this.setCanvasSize();
    this.canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    this.mouse.setCanvasRectFromDomRect(this.canvasRect);
  }

  onMouseDown(event: MouseEvent) : void {
    this.mouse.mouseDown(event);
    let point : Point = new Point(this.mouse.clickedCoordinates!.x - 2, this.mouse.clickedCoordinates!.y - 2);
    this.drawPoint(point);
    this.pointsList.push(point);
  }

  onMouseMove(event: MouseEvent) : void {
    if(!this.mouse.isPressed)
      return;
    this.mouse.mouseMove(event);
    this.context!.clearRect(0,0,this.canvasRect!.width,this.canvasRect!.height);
    this.wallsList.pop();
    this.wallsList.push(new Wall(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!));
    this.drawAllWalls();
    this.drawAllPoints();
  }

  onMouseUp(event: MouseEvent) : void {
    this.mouse.mouseUp(event);
    this.wallsList.push(new Wall(this.mouse.clickedCoordinates!!, this.mouse.currentCoordinates!!));
    let point : Point = new Point(this.mouse.currentCoordinates!.x - 2, this.mouse.currentCoordinates!.y - 2);
    this.drawPoint(point);
    this.pointsList.push(point);
  }

  drawWall(wall: Wall) : void {
    if (this.context) {
      this.context.beginPath();
      this.context.moveTo(wall.firstPoint.x, wall.firstPoint.y);
      this.context.lineTo(wall.secondPoint.x, wall.secondPoint.y);
      this.context.stroke();
    } else {
      console.error('Context is null.');
    }
  }

  drawPoint(point: Point) : void {
    if (this.context) {
      this.context.fillRect(point.x, point.y,5,5);
    } else {
      console.error('Context is null.');
    }
  }

  drawAllWalls() : void {
    this.wallsList.forEach((wall : Wall): void => {
      this.drawWall(wall);
    });
  }
  drawAllPoints() : void {
    this.pointsList.forEach((point : Point): void => {
      this.drawPoint(point);
    });
  }
  setCanvasSize(): void {
    if (this.context) {
      // Set canvas dimensions to match window size
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;
    }
  }
}
