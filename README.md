<head>
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/iconoir-icons/iconoir@main/css/iconoir.css"/>
</head>


<img src="src/assets/logo.png" alt="Logo" style="width: 150px; margin-top: 20px;">

# Digital Blu

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.7.

## Functionalities & instructions

### Architectural Elements

- **Line**
    -
    Icon: <?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 21.1679V14L12 7L16 14V21.1679" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 14C8 14 9.12676 15 10 15C10.8732 15 12 14 12 14C12 14 13.1268 15 14 15C14.8732 15 16 14 16 14" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    - Description: Draw straight lines for partitions or design elements.
    - Access: Click on the line icon in the toolbar.


- **Wall**
    - Icon: <i class="iconoir iconoir-cube"></i>
    - Description: Allows you to draw walls in your architectural plans.
    - Access: Click on the wall icon in the toolbar.


- **Door**
    - Icon: <i class="iconoir iconoir-closet"></i>
    - Description: Insert doors into your design. Available in three types: single left opening, single right opening,
      double.
    - Access: Click on the door icon in the toolbar and place it on a wall, use the up and down arrows to change the
      direction of the door and space to change the type of the door.


- **Window**
    - Icon: <i class="iconoir iconoir-mirror"></i>
    - Description: Add windows to your design.
    - Access: Click on the window icon in the toolbar, and place the window on the desired wall.

### Modes of Operation

- **Draw Mode**
    - Icon: ![Draw Mode Icon](https://iconoir.com/icons/draw-mode.svg)
    - Description: The primary mode for creating and modifying design elements.
    - Access: Select the draw mode icon from the mode selector.

- **Delete Mode**
    - Icon: ![Delete Mode Icon](https://iconoir.com/icons/delete-mode.svg)
    - Description: Enables deletion of selected elements from the canvas.
    - Access: Click on the delete mode icon in the mode selector.

- **Move Mode**
    - Icon: ![Move Mode Icon](https://iconoir.com/icons/move-mode.svg)
    - Description: Allows you to move selected elements around the canvas.
    - Access: Select the move mode icon in the mode selector.

- **Grab Display Mode**
    - Icon: ![Grab Display Mode Icon](https://iconoir.com/icons/grab-display-mode.svg)
    - Description: Enables panning and navigating across the canvas.
    - Access: Click on the grab display mode icon in the mode selector.

### Helper Features

- **Snap Point**
    - Icon: ![Snap Point Icon](https://iconoir.com/icons/snap-point.svg)
    - Description: Snaps elements to predefined points for precision.
    - Access: Enable snap points from the helper tools menu.

- **Snap Angle**
    - Icon: ![Snap Angle Icon](https://iconoir.com/icons/snap-angle.svg)
    - Description: Ensures elements snap to specific angles (e.g., 45°, 90°).
    - Access: Activate snap angles from the helper tools menu.

- **Grid**
    - Icon: ![Grid Icon](https://iconoir.com/icons/grid.svg)
    - Description: Displays a grid to help align and scale elements accurately.
    - Access: Toggle the grid view from the helper tools menu.

### Additional Functionalities

- **Undo/Redo**
    - Icon: ![Undo Icon](https://iconoir.com/icons/undo.svg) ![Redo Icon](https://iconoir.com/icons/redo.svg)
    - Description: Undo and redo actions to easily correct mistakes.
    - Access: Use the undo and redo icons in the toolbar.

- **Clear Canvas**
    - Icon: ![Clear Canvas Icon](https://iconoir.com/icons/clear-canvas.svg)
    - Description: Clears all elements from the current canvas.
    - Access: Click on the clear canvas icon in the toolbar.

- **Save Multiple Canvases**
    - Icon: ![Save Icon](https://iconoir.com/icons/save.svg)
    - Description: Save different versions of your canvases for later use.
    - Access: Use the save option in the file menu.

- **Export Canvas**
    - Icon: ![Export Icon](https://iconoir.com/icons/export.svg)
    - Description: Export your canvas in various formats (e.g., PNG, PDF).
    - Access: Click the export icon in the toolbar.

- **Light Mode/Dark Mode**
  -
  Icon: ![Light Mode Icon](https://iconoir.com/icons/light-mode.svg) ![Dark Mode Icon](https://iconoir.com/icons/dark-mode.svg)
    - Description: Toggle between light and dark themes for better visibility.
    - Access: Use the light/dark mode toggle in the settings menu.

## Technical

### Build + Running application

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you
change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a
package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.