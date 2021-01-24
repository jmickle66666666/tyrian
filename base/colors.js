let Colors = {
    black : 0,
    gray : 1,
    white : 2,
    red : 3,
    meat : 4,
    darkbrown : 5,
    brown : 6,
    orange : 7,
    yellow : 8,
    darkgreen : 9,
    green : 10,
    slimegreen : 11,
    nightblue : 12,
    seablue : 13,
    skyblue : 14,
    cloudblue : 15,
};

ColorData = {};
ColorData.black = {r:0x00,g:0x00,b:0x00};
ColorData.gray = {r:0x9D,g:0x9D,b:0x9D};
ColorData.white = {r:0xFF,g:0xFF,b:0xFF};
ColorData.red = {r:0xBE,g:0x26,b:0x33};
ColorData.meat = {r:0xE0,g:0x6F,b:0x8B};
ColorData.darkbrown = {r:0x49,g:0x3C,b:0x2B};
ColorData.brown = {r:0xA4,g:0x64,b:0x22};
ColorData.orange = {r:0xEB,g:0x89,b:0x31};
ColorData.yellow = {r:0xF7,g:0xE2,b:0x6B};
ColorData.darkgreen = {r:0x2F,g:0x48,b:0x4E};
ColorData.green = {r:0x44,g:0x89,b:0x1A};
ColorData.slimegreen = {r:0xA3,g:0xCE,b:0x27};
ColorData.nightblue = {r:0x1B,g:0x26,b:0x32};
ColorData.seablue = {r:0x00,g:0x57,b:0x84};
ColorData.skyblue = {r:0x31,g:0xA2,b:0xF2};
ColorData.cloudblue = {r:0xB2,g:0xDC,b:0xEF};

ColorKeys = Object.keys(ColorData);

ColorData.get = function(name) {
    let col = ColorData[name];
    return {r: col.r, g: col.g, b: col.b};
}