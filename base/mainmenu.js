let MainMenu = {
    init: function() {
        this.options = [];
        // this.options.push(["start", this.startGame]);
        this.options.push(["keytest", this.keytest]);
        this.options.push(["perftest", function() { loadScene(PerfTest); }]);
        this.options.push(["reload", this.reset]);
        this.options.push(["quit", System.quit]);
        System.unlockMouse();
        System.fogColor(.1, .1, .1);
        loadScene(PerfTest);
    },
    update : function() {
        for (let i = 0; i < this.options.length; i++)
        {
            if (GUI.textButton(this.options[i][0])) {
                this.options[i][1]();
                return;
            }
        }
    },
    currentOption : 0,
    keytest : function () {
        loadScene(KeyTest);
    },
    reset : function() {
        System.reset();
    },
    options : [
    ],
}

let KeyTest = {
    update : function() {
        Draw.text(0, 0, Colors.black, Input.lastKeyDown);
        if (Input.GetDown[Key.Enter]) {
            loadScene(MainMenu);
        }
    }
}