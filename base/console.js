let Console = {

    key : Key.Backslash,
    open : false,
    current : "",
    messages : [],
    commandHistory : [],
    historyPosition : 0,
    maxMessages : 28,
    hasError : false,
    errorBorderSize : 2,
    errorOffset : 0,

    commands : [
        {name:"test", proc: function() { Console.log("test!"); }},
        {name:"reset", proc: function() { System.reset(); }},
    ],

    draw : function() {
        this.errorOffset += dt * 8;
        this.errorOffset %= this.errorBorderSize;
        if (!this.open) return;
        this.hasError = false;
        if (Input.anyKeyDown) {
            if (Input.GetDown[Key.Up]) {
                if (this.commandHistory.length > 0) {
                    this.historyPosition += 1;
                    this.current = this.commandHistory[this.commandHistory.length - this.historyPosition];
                }
            } else if (Input.GetDown[Key.Enter]) {
                this.historyPosition = 0;
                this.commandHistory.push(this.current);
                this.log("> "+this.current);
                this.run(this.current);
                this.current = "";
            } else if (Input.GetDown[Key.Backspace]) {
                this.current = this.current.substring(0, this.current.length - 1);
            } else {
                this.current += lastchar;
            }
        }

        Draw.rect(0, 0, screenSize.x, 8 * (this.messages.length+1) + 2, Colors.black);
        for (let i = Math.min(this.messages.length - 1, this.maxMessages); i >= 0; i--)
        {
            Draw.text(0, (i+1) * 8, this.messages[-1+ this.messages.length - i].color, this.messages[-1 + this.messages.length - i].message);
        }
        Draw.text (0, 0, Colors.white, "> "+this.current);
    },

    run : function(command) {

        for (let i = 0; i < this.commands.length; i++) {
            if (this.commands[i].name == command) {
                this.commands[i].proc();
                return;
            }
        }

        try {
            exec(this.current);
        } catch (e) {
            this.logError(e.message);
        }
    },

    drawError : function() {
        let eo = Math.round(this.errorOffset);
        Draw.textureTiled(0, eo, this.errorBorderSize, screenSize.y - eo, "gui/warning");
        Draw.textureTiled(-eo, 0, screenSize.x+eo, this.errorBorderSize, "gui/warning");
        Draw.textureTiled(screenSize.x - this.errorBorderSize, -eo, this.errorBorderSize, screenSize.y+eo, "gui/warning");
        Draw.textureTiled(eo, screenSize.y - this.errorBorderSize, screenSize.x-eo, this.errorBorderSize, "gui/warning");
    },

    message : function(color, message) {
        this.messages.push({color:color, message:message});
    },

    log : function(message) {
        this.message(Colors.gray, message);
    },

    logWarning : function(message) {
        this.message(Colors.orange, message);
    },

    logError : function(message) {
        this.hasError = true;
        this.message(Colors.red, message);
    },
}