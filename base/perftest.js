let PerfTest = {
    count : 10,
    
    init: function() {
        camera.ortho = true;
        camera.orthoScale = 11/3;
        // this.addSprites();

        let tileset = [
            0, 1, 2, 3, 4, 5,
            8, 9, 10, 11, 12,
            16, 17, 18, 19, 20
        ];

        let tileNeighbors = {};
        tileNeighbors[0] = { r: [ 0, 2, 10, 18, ], u: [ 0, 18, 19, 20, ] };
        tileNeighbors[1] = { r: [ 1, 9, 11, 12, 17 ], u: [ 1, 3, 8, 9, 11 ] };
        tileNeighbors[2] = { r: [ 3, 4, 8, ], u: tileNeighbors[0].u };
        tileNeighbors[3] = { r: tileNeighbors[2].r, u: tileNeighbors[0].u };
        tileNeighbors[4] = { r: tileNeighbors[0].r, u: tileNeighbors[0].u };

        tileNeighbors[8] = { r: tileNeighbors[1].r, u: [ 2, 10, 16, ] };
        tileNeighbors[9] = { r: tileNeighbors[2].r, u: [ 4, 12, 17, ] };
        tileNeighbors[10] = { r: tileNeighbors[1].r, u: tileNeighbors[8].u };
        tileNeighbors[11] = { r: tileNeighbors[1].r, u: tileNeighbors[1].u };
        tileNeighbors[12] = { r: tileNeighbors[0].r, u: tileNeighbors[9].u };

        tileNeighbors[16] = { r: tileNeighbors[1].r, u: tileNeighbors[1].u };
        tileNeighbors[17] = { r: [ 16, 19, 20, ], u: tileNeighbors[1].u };
        tileNeighbors[18] = { r: tileNeighbors[17].r, u: tileNeighbors[8].u };
        tileNeighbors[19] = { r: tileNeighbors[17].r, u: tileNeighbors[1].u };
        tileNeighbors[20] = { r: tileNeighbors[0].r, u: tileNeighbors[9].u };
        
        for (let i = 0; i < this.tileWidth; i++)
        {
            let curRow = [];
            for (let j = 0; j < this.tileHeight; j++)
            {
                curRow.push(-1);
            }
            this.tiles.push(curRow);
        }

        for (let j = 0; j < this.tileHeight; j++)
        {
            for (let i = 0; i < this.tileWidth; i++)
            {
                if (i == 0 && j == 0) {
                    this.tiles[i][j] = Math.choice([0, 1]);
                } else {
                
                    let possibilities = tileset;

                    if (i != 0) {
                        // Console.log(this.tiles[i - 1][j]);/
                        let options = tileNeighbors[this.tiles[i - 1][j]].r;
                        let newPoss = [];
                        for (var o in options) {
                            if (possibilities.indexOf(options[o]) != -1) {
                                newPoss.push(options[o]);
                            }
                        }
                        possibilities = newPoss;
                    }

                    if (j != 0) {
                        let options = tileNeighbors[this.tiles[i][j - 1]].u;
                        let newPoss = [];
                        for (var o in options) {
                            if (possibilities.indexOf(options[o]) != -1) {
                                newPoss.push(options[o]);
                            }
                        }
                        possibilities = newPoss;
                    }

                    if (possibilities.length > 0) {
                        this.tiles[i][j] = Math.choice(possibilities);
                    } else {
                        Console.log("no possibilities");
                        this.tiles[i][j] = 0;
                    }

                }
            }
        }

        // this.buildBackgroundMesh();
    },

    time : 0,

    update: function() {
        this.time += dt;

        

        // if (this.mesh != null) Draw.mesh(this.mesh, 0,0,1, 0,0,0, "sprites/tiles");
        this.drawbackground();
        this.playerUpdate();
        this.bulletUpdate();

        let frame = 96;
        if (Input.Get[Key.Left] && !Input.Get[Key.Right]) {
            frame -= 64;
        }

        if (!Input.Get[Key.Left] && Input.Get[Key.Right]) {
            frame -= 32;
        }
        Draw.texturePart(this.px - 16, this.py - 16, "sprites/sprites", 16, frame, 32, 32);

        // for (let i = 0; i < this.sprites.length; i++)
        // {
        //     this.sprites[i] += dt;
        //     let t = this.sprites[i];
        //     let dx = 160 + Math.floor(Math.sin(time + t) * 90);
        //     let dy = 120 + Math.floor(Math.sin(t + time * 0.61256) * 104);

        //     Draw.texture(dx - 16, dy - 16, "sprites/ship1");
        // }

        // if (Input.GetDown[Key.H]) this.showSprite = !this.showSprite;
        // if (Input.GetDown[Key.G]) this.addSprites();
        if (Input.GetDown[Key.R]) System.reset();
        if (Input.GetDown[Key.Escape]) loadScene(MainMenu);

        // Draw.text(0, 0, 0, dt);
    },

    px : 160,
    py : 20,

    moveSpeed : 2500,

    ax : 0,
    ay : 0,

    playerUpdate: function() {
        let mx = 0;
        let my = 0;
        if (Input.Get[Key.Left]) mx -= 1;
        if (Input.Get[Key.Right]) mx += 1;
        if (Input.Get[Key.Down]) my -= 1;
        if (Input.Get[Key.Up]) my += 1;

        this.ax += this.moveSpeed * mx * dt;
        this.ay += this.moveSpeed * my * dt;
        this.ax *= Math.exp(-9 * dt);
        this.ay *= Math.exp(-9 * dt);

        this.px += this.ax * dt;
        this.py += this.ay * dt;
        this.px = Math.clamp(this.px, 16, 320-16);
        this.py = Math.clamp(this.py, 16, 240-16);
    },

    bullets : [],
    bulletSpeed : 200,
    bulletRate : .1,
    bulletCooldown : 0,

    bulletUpdate: function() {
        let l = this.bullets.length;
        for (let i = 0; i < l; i++)
        {
            this.bullets[i].y += dt * this.bulletSpeed;
            Draw.texturePart(
                this.bullets[i].x - 8, 
                this.bullets[i].y - 8, 
                "sprites/sprites", 
                0, 112-32, 16, 16
            );
        }

        this.bulletCooldown -= dt;
        if (Input.Get[Key.Z] && this.bulletCooldown < 0) {
            this.bulletCooldown = this.bulletRate;
            this.addBullet(this.px, this.py);
        }
    },

    addBullet: function(x, y) {
        this.bullets.push({x: x, y: y});
    },

    // addSprites: function() {
    //     for (let i = 0; i < this.count; i++) {
    //         this.sprites.push(10 + Math.random() * 10);
    //     }
    // },

    tileWidth : 14,
    tileHeight : 25,
    tiles : [],
    mesh : null,
    tileSpeed : 2,

    drawbackground:function() {
        let tStart = Math.floor(this.time * this.tileSpeed);
        for (let i = 0; i < this.tileWidth; i++)
        {
            for (let j = tStart; j < Math.min(this.tileHeight + tStart - 14, this.tileHeight); j++)
            {
                let tileCoords = {
                    x: (this.tiles[i][j] % 8) * 24,
                    y: Math.floor(this.tiles[i][j] / 8) * 24
                };
                tileCoords.y = (192-24) - tileCoords.y;
                Draw.texturePart(
                    i * 24, Math.round(-this.time*24 * this.tileSpeed + (j * 24)), "sprites/tiles", tileCoords.x, tileCoords.y, 24, 24
                );
            }
        }
    },

    // buildBackgroundMesh: function() {

    //     let verts = [];
    //     let tris = [];
    //     let uvs = [];
    //     let colors = [];
    //     for (let i = 0; i < this.tileWidth; i++)
    //     {
    //         for (let j = 0; j < this.tileHeight; j++)
    //         {
    //             let t = this.tiles[i][j];
    //             let vlen = verts.length;
    //             verts.push(
    //                 {x: i, y: j, z:0},
    //                 {x: i, y: j+1, z:0},
    //                 {x: i+1, y: j+1, z:0},
    //                 {x: i+1, y: j, z:0}
    //             );
    //             tris.push(
    //                 vlen + 0, vlen + 1, vlen + 2, vlen + 0, vlen + 2, vlen + 3
    //             );
    //             uvs.push(
    //                 {x: t * .125, y: .875},
    //                 {x: t * .125, y: 1},
    //                 {x: .125 + t * .125, y: 1},
    //                 {x: .125 + t * .125, y: .875}
    //             );
    //             colors.push(ColorData.white,ColorData.white,ColorData.white,ColorData.white);
    //         }
    //     }

    //     this.mesh = Mesh.create(verts, tris, uvs, colors);
    // },

    // sprites: [],
}