function update()
{
    Draw.clear();

    if (Input.GetDown[Console.key]) {
        Input.reset();
        Console.open = !Console.open;
    }
    Console.draw();
    
    if (Console.open) {
        Input.reset();
        return;
    }

    if (loadingScene > 0) {
        if (loadingScene == 2) {
            loadingScene = 1;
            GUI.resetPosition();
            GUI.label("loading...", Colors.white);
        } else {
            loadingScene = 0;
            control = nextScene;
            if (control.init != null) control.init();
        }
    } else {
        if (control != null) {
            control.update();
        }
    }
    
    if (Input.GetDown[Key.F12]) {
        System.screenshot("screenshot_"+Math.floor(Math.random()*100000)+".png");
    }

    Input.reset();
    GUI.update();

    if (Console.hasError) {
        Console.drawError();
    }
}

function clone(object)
{
    return JSON.parse(JSON.stringify(object));
}

let loadingScene = 0;
let nextScene = null;
function loadScene(controller)
{
    nextScene = controller;
    loadingScene = 2;
}

let control = MainMenu;

function start() {

    let resolution = {
        x: Config.getInt("resolution_x", 640),
        y: Config.getInt("resolution_y", 480)
    };

    System.unlockMouse();

    System.setResolution(resolution.x, resolution.y);

    MainMenu.init();
}

function reset() {
    System.reset();
}

Console.log("-- DISASTER ENGINE 2.0 --");

start();