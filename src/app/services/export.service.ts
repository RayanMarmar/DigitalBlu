import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    constructor() {
    }

    exportCanvasAsSVG(canvas: HTMLCanvasElement, filename: string): void {
        // Convert canvas content to SVG
        const svgContent = this.convertCanvasToSvg(canvas);

        // Create a download link for the SVG
        const blob = new Blob([svgContent], {type: 'image/svg+xml'});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename + '.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    private convertCanvasToSvg(canvas: HTMLCanvasElement): string {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        //svgPath.setAttribute('d', canvas.toDataURL());
        svg.appendChild(svgPath);
        return svg.outerHTML;
    }
}
