<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/iconoir@latest/iconoir.css">
</head>

<img src="src/assets/logo.png" alt="Logo" style="width: 150px; margin-right: 20px">
<img src="src/assets/logo.png" alt="Logo" style="filter: invert() hue-rotate(100deg); width: 150px; margin-top: 20px">

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.7.

## Functionalities & instructions

### Architectural Elements

- **Line**
    - Icon: <i class="iconoir iconoir-design-pencil"></i>
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