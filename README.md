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
    - Icon: <img src="icons/design-pencil.svg">
    - Description: Draw straight lines for partitions or design elements.
    - Access: Click on the line icon in the toolbar.


- **Wall**
    - Icon: <img src="icons/cube.svg">
    - Description: Allows you to draw walls in your architectural plans.
    - Access: Click on the wall icon in the toolbar.


- **Door**
    - Icon: <img src="icons/closet.svg">
    - Description: Insert doors into your design. Available in three types: single left opening, single right opening,
      double.
    - Access: Click on the door icon in the toolbar and place it on a wall, use the up and down arrows to change the
      direction of the door and space to change the type of the door.


- **Window**
    - Icon: <img src="icons/mirror.svg">
    - Description: Add windows to your design.
    - Access: Click on the window icon in the toolbar, and place the window on the desired wall.

### Modes of Operation

- **Draw Mode**
    - Icon: <img src="icons/design-pencil.svg"><img src="icons/cube.svg">
    - Description: The primary mode for creating and modifying design elements.
    - Access: The draw mode is automatically selected when one of the two icons are selected (Line, Wall).

- **Delete Mode**
    - Icon: <img src="icons/erase.svg">
    - Description: Enables deletion of selected elements from the canvas.
    - Access: Click on the delete mode icon in the mode selector and then click on the elements to delete them.

- **Move Mode**
    - Icon: <img src="icons/cursor-pointer.svg">
    - Description: Allows you to move selected elements around the canvas.
    - Access: Select the move mode icon in the mode selector.

- **Grab Display Mode**
    - Icon: <img src="icons/drag-hand-gesture.svg">
    - Description: Enables panning and navigating across the canvas.
    - Access: Click on the grab display mode icon in the mode selector.

### Helper Features

- **Snap Point**
    - Icon: <img src="icons/one-point-circle.svg">
    - Description: Snaps elements to predefined points for precision.
    - Access: Enable snap points from the helper tools menu.

- **Snap Angle**
    - Icon: <img src="icons/angle-tool.svg">
    - Description: Ensures elements snap to specific angles (e.g., 45°, 90° etc...).
    - Access: Activate snap angles from the helper tools menu.

- **Grid**
    - Icon: <img src="icons/orthogonal-view.svg">
    - Description: Displays a grid to help align elements accurately.
    - Access: Toggle the grid view from the helper tools menu.

- **Change global values**
    - Icon: <img src="icons/control-slider.svg">
    - Description: Change the global values of three components, the wall thickness, the grid unit measure, and the
      display of the elements measures.
    - Access: Press the icon in the toolbar and changed the values in the modal.

- **Shift key**
    - Icon: <img src="icons/arrow-up-circle.svg">
    - Description: Draw horizontal or vertical lines while pressing the shift key.
    - Access: Press the shift key and draw.

### Additional Functionalities

- **Undo/Redo**
    - Icon: <img src="icons/undo-circle.svg"> <img src="icons/redo-circle.svg">
    - Description: Undo and redo actions to easily correct mistakes.
    - Access: Use the undo and redo icons in the toolbar.

- **Clear Canvas**
    - Icon: <img src="icons/bin-full.svg">
    - Description: Clears all elements from the current canvas.
    - Access: Click on the clear canvas icon in the toolbar.

- **Save Multiple Canvases**
    - Icon: <img src="icons/floppy-disk.svg">
    - Description: Save different versions of your canvases for later use.
    - Access: Use the save option in the toolbar.

- **Open recent saved canvases**
    - Icon: <img src="icons/folder.svg">
    - Description: Open your recent saved canvases.
    - Access: Access the folder on the toolbar.

- **Export Canvas**
    - Icon: <img src="icons/share-ios.svg">
    - Description: Export your canvas.
    - Access: Click the export icon in the toolbar.

- **Light Mode/Dark Mode**
    - Icon: <img src="icons/brightness.svg">
    - Description: Toggle between light and dark themes for better visibility.
    - Access: Use the light/dark mode toggle in the toolbar.

### Need more help ?

**Helper & shortcuts**

- Icon: <img src="icons/help-circle.svg">
- Description: Open helper and shortcut display.
- Access: Use the Helper icon in the toolbar.

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