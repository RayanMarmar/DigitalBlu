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

    convertCanvasToSvg(canvas: HTMLCanvasElement): string {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            const svgImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            svgImage.setAttribute('xlink:href', dataUrl);
            svgImage.setAttribute('width', canvas.width.toString());
            svgImage.setAttribute('height', canvas.height.toString());
            svg.appendChild(svgImage);
        }
        return svg.outerHTML;
    }
}
