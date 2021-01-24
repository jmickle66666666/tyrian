let PerfTest = {
    count : 10,
    
    init: function() {
        camera.ortho = true;
        camera.orthoScale = 11/3;
        // this.addSprites();

        
        for (let i = 0; i < this.tileWidth; i++)
        {
            let curRow = [];
            for (let j = 0; j < this.tileHeight; j++)
            {
                curRow.push(Math.random() < 0.5?1: 0);
            }
            this.tiles.push(curRow);
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
        Draw.texturePart(this.px - 16, this.py - 16, "sprites/sprites", 16, 96, 32, 32);

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

        Draw.text(0, 0, 0, dt);
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
                0, 112-16, 16, 16
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
    tileHeight : 10,
    tiles : [],
    mesh : null,

    drawbackground:function() {
        for (let i = 0; i < this.tileWidth; i++)
        {
            for (let j = 0; j < this.tileHeight; j++)
            {
                Draw.texturePart(
                    i * 24, j * 24, "sprites/tiles", this.tiles[i][j]==1?24:0, 168, 24, 24
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