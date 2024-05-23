interface AppState {
    currentCanvas: string;
    theme: string;
    thickness: number;
    canvases: {
        [canvasName: string]: string | {
            linesList: {
                _firstPoint: { _x: number; _y: number; };
                _secondPoint: { _x: number; _y: number; };
            }[];
            wallsList: {
                _firstPoint: { _x: number; _y: number; };
                _secondPoint: { _x: number; _y: number; };
                _height: number;
                _matrix: { _reverseTransformationMatrix: number[][]; };
                _uid: string;
            }[];
            doorsList: {
                _uid: string;
                _point: { _x: number; _y: number; };
                _doorType: number;
                _direction: number;
                _width: number;
                _radius: number;
            }[];
            windowsList: { _uid: string; _point: { _x: number; _y: number; }; _width: number; }[];
        };
    };
}