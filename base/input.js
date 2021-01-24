let Key = {
    Backspace : 8,
    Tab : 9,
    Enter : 13,
    Escape : 27,
    Space : 32,
    Alpha1 : 49,
    Alpha2 : 50,
    Alpha3 : 51,
    Alpha4 : 52,
    Alpha5 : 53,
    Alpha6 : 54,
    Alpha7 : 55,
    Backslash : 92,
    Grave : 96,
    A : 97,
    B : 98,
    C : 99,
    D : 100,
    E : 101,
    F : 102,
    G : 103,
    H : 104,
    I : 105,
    J : 106,
    K : 107,
    L : 108,
    M : 109,
    N : 110,
    O : 111,
    P : 112,
    Q : 113,
    R : 114,
    S : 115,
    T : 116,
    U : 117,
    V : 118,
    W : 119,
    X : 120,
    Y : 121,
    Z : 122,
    Delete : 127,
    Up : 273,
    Down : 274,
    Right : 275,
    Left : 276,
    F12 : 293,
    LeftShift : 304,
    LeftControl : 306
};

let Input = {
    Get : {},
    GetDown : {},
    GetUp : {},
    // call at the end of your update loop
    reset : function()
    {
        anyKeyDown = false;
        anyKeyUp = false;
        for (var member in Input.GetDown) Input.GetDown[member] = false;
        for (var member in Input.GetUp) Input.GetUp[member] = false;
        for (var member in Input.MouseDown) Input.MouseDown[member] = false;
        for (var member in Input.MouseUp) Input.MouseUp[member] = false;
        lastchar = "";
    },
    lastKeyDown : -1,
    lastKeyUp : -1,
    anyKeyDown : false,
    anyKeyUp : false,
    Mouse : {},
    MouseUp : {},
    MouseDown : {},
};

// event listeners from the engine
let lastchar = "";

function keydown(key)
{
    Input.Get[key] = true;
    Input.GetDown[key] = true;
    Input.anyKeyDown = true;

    if (key != 0) {
        Input.lastKeyDown = key;
    }
}

function keyup(key)
{
    Input.Get[key] = false;
    Input.GetUp[key] = true;
    Input.anyKeyUp = true;

    if (key != 0) {
        Input.lastKeyUp = key;
    }
}

function mousedown(button)
{
    Input.Mouse[button] = true;
    Input.MouseDown[button] = true;
}

function mouseup(button)
{
    Input.Mouse[button] = false;
    Input.MouseUp[button] = true;
}