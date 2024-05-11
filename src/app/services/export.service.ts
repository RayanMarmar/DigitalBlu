import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    constructor() {
    }

    exportCanvasAsSVG(canvas: HTMLCanvasElement, filename: string): void {
        // Convert canvas content to SVG
        const svgContent: string = this.convertCanvasToSvg(canvas);

        // Create a download link for the SVG
        const blob: Blob = new Blob([svgContent], {type: 'image/svg+xml'});
        const url: string = window.URL.createObjectURL(blob);
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = url;
        link.download = filename + '.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    convertCanvasToSvg(canvas: HTMLCanvasElement): string {
        // Convert canvas to data URL
        const dataURL: string = canvas.toDataURL('image/png');

        // Create an image element
        const img: HTMLImageElement = new Image();

        // Set the data URL as the source of the image
        img.src = dataURL;

        // Wait for the image to load
        // Create a new SVG element
        const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink'); // Define xlink namespace
        svg.setAttribute('width', canvas.width.toString());
        svg.setAttribute('height', canvas.height.toString());

        // Create an image element to embed the canvas
        const image: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataURL); // Use xlink:href
        image.setAttribute('width', canvas.width.toString());
        image.setAttribute('height', canvas.height.toString());

        // Append the image to SVG
        svg.appendChild(image);
        return svg.outerHTML;
    }
}
