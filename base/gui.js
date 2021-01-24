let GUI = {
    horizontal : false,
    hovered : false,
    position: {x:0, y:0},
    resetPosition: function() {
        GUI.id = -1;
        GUI.position = {x:0, y:screenSize.y};
    },
    changed : false,
    id : -1,
    keyboardFocus : -1,
    oldTextValue : "",
    fontWidth : 6,
    fontHeight : 8,
    height: 16,
    fontHeightOffset: -4,

    lineSpacing : 1,
    toastTimer : 0,
    toastText : "",
    comboOpen : -1,
    update : function() {
        if (this.toastTimer > 0) {
            let width = (this.toastText.length + 2) * this.fontWidth;
            Draw.rect(screenSize.x/2 - width/2, 0, width, this.fontHeight, Colors.black);
            Draw.text(GUI.fontWidth + screenSize.x/2 - width/2, 0, Colors.white, this.toastText);
            this.toastTimer -= dt;
        }

        this.hovered = false;
        this.resetPosition();
    }
};

GUI.label = function(message, color)
{
    GUI.id += 1;
    if (!GUI.horizontal) GUI.position.y -= GUI.height + GUI.lineSpacing;
    let length = message.length * GUI.fontWidth;
    Draw.rect(GUI.position.x, GUI.position.y, length, GUI.height, Colors.black);
    Draw.text(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, color, message);
    if (GUI.horizontal) GUI.position.x += length;
}

GUI.toast = function(message)
{
    GUI.toastTimer = 2 + message.length * 0.25;
    GUI.toastText = message;
}

GUI.imageButton = function(texture)
{
    GUI.id += 1;
    let size = Draw.getSize(texture);
    let width = size.x;
    let height = size.y;
    if (!GUI.horizontal) GUI.position.y -= height + GUI.lineSpacing;
    Draw.texture(GUI.position.x, GUI.position.y, texture);
    if (mouse.x > GUI.position.x && mouse.y > GUI.position.y && mouse.x <= GUI.position.x + width && mouse.y <= GUI.position.y + height) {
        GUI.hovered = true;

        Draw.rect(GUI.position.x, GUI.position.y, width, 1, Colors.white);
        Draw.rect(GUI.position.x, GUI.position.y + height-1, width, 1, Colors.white);
        Draw.rect(GUI.position.x, GUI.position.y, 1, height, Colors.white);
        Draw.rect(GUI.position.x + width-1, GUI.position.y, 1, height, Colors.white);

        if (Input.MouseDown[0]) {
            GUI.changed = true;
            if (GUI.horizontal) GUI.position.x += width;
            Input.reset();
            return true;
        }
    }
    if (GUI.horizontal) GUI.position.x += width;
    return false;
}

GUI.combobox = function(current, list)
{
    GUI.id += 1;
    let id = GUI.id;
    
    if (GUI.comboOpen == id) {
        for (let i = 0; i < list.length; i++)
        {
            if (GUI.textButton(list[i])) {
                Input.reset();
                return list[i];
            }
        }
    } else {
        let changed = GUI.changed;
        if (GUI.textButton(current)) {
            GUI.comboOpen = id;
            GUI.changed = changed;
            Input.reset();
        }
    }
    return current;
}

GUI.textButton = function (text)
{
    GUI.id += 1;
    if (!GUI.horizontal) GUI.position.y -= GUI.height + GUI.lineSpacing;
    let length = text.length * GUI.fontWidth;
    Draw.rect(GUI.position.x, GUI.position.y, length, GUI.height, Colors.black);
    if (mouse.x > GUI.position.x && mouse.y > GUI.position.y && mouse.x <= GUI.position.x + length && mouse.y <= GUI.position.y + GUI.height) {
        Draw.text(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, Colors.white, text);
        GUI.hovered = true;
        if (Input.MouseDown[0]) {
            GUI.changed = true;
            if (GUI.horizontal) GUI.position.x += length;
            Input.reset();
            return true;
        }
    } else {
        Draw.text(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, Colors.gray, text);
    }
    if (GUI.horizontal) GUI.position.x += length;
    return false;
}

GUI.checkbox = function (label, active)
{
    GUI.id += 1;
    if (!GUI.horizontal) GUI.position.y -= GUI.height + GUI.lineSpacing;
    let length = 12 + label.length * GUI.fontWidth;
    Draw.rect(GUI.position.x, GUI.position.y, length, GUI.height, Colors.black);
    if (mouse.x > GUI.position.x && mouse.y > GUI.position.y && mouse.x <= GUI.position.x + length && mouse.y <= GUI.position.y + GUI.height) {
        Draw.texture(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, active?"gui/check_onB":"gui/check_offB");
        GUI.hovered = true;
        if (Input.MouseDown[0]) {
            GUI.changed = true;
            if (GUI.horizontal) GUI.position.x += length;
            return !active;
        }
    } else {
        Draw.texture(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, active?"gui/check_onA":"gui/check_offA");
    }

    Draw.text(GUI.position.x + 16, GUI.position.y - GUI.fontHeightOffset, Colors.white, label);
    if (GUI.horizontal) GUI.position.x += length;
    return active;
}

GUI.doublefield = function (label, value)
{
    GUI.id += 1;
    if (!GUI.horizontal) GUI.position.y -= GUI.height + GUI.lineSpacing;

    let text = value.toString();
    if (value < 1) {
        text = "1/"+(1 / value).toString();
    }

    let length = (label.length + text.length + 4) * GUI.fontWidth;
    length += GUI.fontHeight * 2;
    Draw.rect(GUI.position.x, GUI.position.y, length, GUI.height, Colors.black);

    if (VMath.inrect(mouse, GUI.position.x, GUI.position.y, GUI.fontHeight, GUI.height)) {
        Draw.texture(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, "gui/arrow_leftB");
        GUI.hovered = true;
        if (Input.MouseDown[0]) {
            GUI.changed = true;
            value /= 2;
        }
    } else {
        Draw.texture(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, "gui/arrow_leftA");
    }

    if (VMath.inrect(mouse, GUI.position.x + length - GUI.fontHeight, GUI.position.y, GUI.fontHeight, GUI.height)) {
        Draw.texture(GUI.position.x + length - GUI.fontHeight, GUI.position.y - GUI.fontHeightOffset, "gui/arrow_rightB");
        GUI.hovered = true;
        if (Input.MouseDown[0]) {
            GUI.changed = true;
            value *= 2;
        }
    } else {
        Draw.texture(GUI.position.x + length - GUI.fontHeight, GUI.position.y - GUI.fontHeightOffset, "gui/arrow_rightA");
    }

    Draw.text(GUI.position.x + GUI.fontHeight + GUI.fontWidth, GUI.position.y - GUI.fontHeightOffset, Colors.gray, label + ": " + text);
    if (GUI.horizontal) GUI.position.x += length;
    return value;
}

GUI.intfield = function (label, value)
{
    GUI.id += 1;
    if (!GUI.horizontal) GUI.position.y -= GUI.height + GUI.lineSpacing;
    let length = (label.length + value.toString().length + 4) * GUI.fontWidth;
    length += GUI.fontHeight * 2;
    Draw.rect(GUI.position.x, GUI.position.y, length, GUI.fontHeight, Colors.black);

    if (VMath.inrect(mouse, GUI.position.x, GUI.position.y, GUI.fontHeight, GUI.height)) {
        Draw.texture(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, "gui/arrow_leftA");
        GUI.hovered = true;
        if (Input.MouseDown[0]) {
            GUI.changed = true;
            value -= 1;
        }
    } else {
        Draw.texture(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, "gui/arrow_leftB");
    }

    if (VMath.inrect(mouse, GUI.position.x + length - GUI.fontHeight, GUI.position.y, GUI.fontHeight, GUI.height)) {
        Draw.texture(GUI.position.x + length - GUI.fontHeight, GUI.position.y - GUI.fontHeightOffset, "gui/arrow_rightA");
        GUI.hovered = true;
        if (Input.MouseDown[0]) {
            GUI.changed = true;
            value += 1;
        }
    } else {
        Draw.texture(GUI.position.x + length - GUI.fontHeight, GUI.position.y - GUI.fontHeightOffset, "gui/arrow_rightB");
    }

    Draw.text(GUI.position.x + GUI.fontHeight + GUI.fontWidth, GUI.position.y - GUI.fontHeightOffset, Colors.white, label + ": " + value);
    if (GUI.horizontal) GUI.position.x += length;
    return value;
}

GUI.rangefield = function(label, value, min, max, width)
{
    GUI.id += 1;
    if (!GUI.horizontal) GUI.position.y -= GUI.height + GUI.lineSpacing;
    Draw.rect(GUI.position.x, GUI.position.y, width, GUI.height, Colors.black);
    if (VMath.inrect(mouse, GUI.position.x, GUI.position.y, width, GUI.height)) {
        GUI.hovered = true;
        if (Input.Mouse[0]) {
            GUI.changed = true;
            value = min + ((mouse.x - GUI.position.x) / width) * (max - min);
        }
    }

    let length = (label.length + value.toString().length + 2) * GUI.fontWidth;
    length = (width/2) - (length / 2);

    let valueText = (Math.floor(value * 100)/100).toString();

    Draw.text(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, Colors.gray, label + ": " + valueText);
    Draw.line(GUI.position.x + ((value-min) / (max - min)) * width, GUI.position.y, GUI.position.x + ((value-min) / (max - min)) * width, GUI.position.y + GUI.height, Colors.white);
    if (GUI.horizontal) GUI.position.x += length;
    return value;
}

GUI.textfield = function (label, text)
{
    GUI.id += 1;
    if (!GUI.horizontal) GUI.position.y -= GUI.height + GUI.lineSpacing;
    let length = (label.length + text.length + 1) * GUI.fontWidth;
    Draw.rect(GUI.position.x, GUI.position.y, length, GUI.height, Colors.black);

    if (GUI.keyboardFocus == GUI.id) {

        if (Input.anyKeyDown) {

            if (Input.GetDown[Key.Enter]) {
                GUI.keyboardFocus = -1;
            } else if (Input.GetDown[Key.Escape]) {
                text = GUI.oldTextValue;
                GUI.keyboardFocus = -1;
            } else if (Input.GetDown[Key.Backspace]) {
                if (text.length > 0) {
                    text = text.substring(0, text.length - 1);
                }
            } else {
                text += lastchar;
            }
        }

        Draw.line(GUI.position.x + length, GUI.position.y, GUI.position.x + length, GUI.position.y+GUI.height, Colors.white);

    } else {
        if (mouse.x > GUI.position.x && mouse.y > GUI.position.y && mouse.x <= GUI.position.x + length && mouse.y <= GUI.position.y + GUI.height) {
            GUI.hovered = true;
            if (Input.MouseDown[0]) {
                GUI.keyboardFocus = GUI.id;
                GUI.oldTextValue = text;
            }
        }
    }

    Draw.text(GUI.position.x, GUI.position.y - GUI.fontHeightOffset, Colors.white, label + " " + text);
    if (GUI.horizontal) GUI.position.x += length;
    return text;
}