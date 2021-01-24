function Vector3(x, y, z)
{
    return {
        x: x, y: y, z: z,
        magnitude: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        sqrMagnitude: function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        normalised: function () {
            let mag = this.magnitude();
            return Vector3(x / mag, y / mag, z / mag);
        },
        normalise: function () {
            let mag = this.magnitude();
            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
        },
        setLength: function(length) {
            let mag = this.magnitude();
            this.x *= length / mag;
            this.y *= length / mag;
            this.z *= length / mag;
        },
        add: function(vec2) {
            this.x += vec2.x;
            this.y += vec2.y;
            this.z += vec2.z;
        },
        sub: function(vec2) {
            this.x -= vec2.x;
            this.y -= vec2.y;
            this.z -= vec2.z;
        },
        multiply: function(amount) {
            this.x *= amount;
            this.y *= amount;
            this.z *= amount;
        },
        clone: function() {
            return Vector3(this.x, this.y, this.z);
        }
    };
}

function Vector2(x, y)
{
    return {
        x: x, y: y, 
        magnitude: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        sqrMagnitude: function () {
            return this.x * this.x + this.y * this.y;
        },
        normalised: function () {
            let mag = this.magnitude();
            return Vector2(x / mag, y / mag);
        },
        normalise: function () {
            let mag = this.magnitude();
            if (mag == 0) { this.x = 0; this.y=0; return;}
            this.x /= mag;
            this.y /= mag;
        },
        add: function(vec2) {
            this.x += vec2.x;
            this.y += vec2.y;
        },
        sub: function(vec2) {
            this.x -= vec2.x;
            this.y -= vec2.y;
        },
        multiply: function(amount) {
            this.x *= amount;
            this.y *= amount;
        },
        equals: function(vec2) {
            return (vec2.x == this.x && vec2.y == this.y);
        },
        clone: function() {
            return new Vector2(this.x, this.y);
        }
    };
}

let VMath = {
    dot : function(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    },
    distance : function(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    squareDistance : function(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    },
    forwardVector: function(yRot, xRot) {
        xRot *= Math.PI / 180;
        yRot *= Math.PI / 180;
        return Vector3(
            Math.sin(yRot)*Math.cos(xRot),
            -Math.sin(xRot),
            Math.cos(yRot)*Math.cos(xRot)
        );
    },
    dot2d : function(a, b) {
        return a.x * b.x + a.y * b.y;
    },
    cross2d: function(a, b, o) {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
    },
    distance2d : function(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    pointInTriangle: function(P, A, B, C) {
        // Compute vectors        
        function vec(from, to) {  return Vector2(to.x - from.x, to.y - from.y);  }
        var v0 = vec(A, C);
        var v1 = vec(A, B);
        var v2 = vec(A, P);
        // Compute dot products
        function dot(u, v) {  return u.x * v.x + u.y * v.y;  }
        var dot00 = dot(v0, v0);
        var dot01 = dot(v0, v1);
        var dot02 = dot(v0, v2);
        var dot11 = dot(v1, v1);
        var dot12 = dot(v1, v2);
        // Compute barycentric coordinates
        var invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        // Check if point is in triangle
        return (u >= 0) && (v >= 0) && (u + v < 1);
    },
    inrect: function (p, x, y, w, h) {
        return (p.x >= x && p.x < x + w && p.y >= y && p.y < y + h);
    },
    circleVsTriangleBounds: function(px, py, width, ax, ay, bx, by, cx, cy)
    {
        let mintx = Math.min(Math.min(ax, bx), cx) - width;
        let minty = Math.min(Math.min(ay, by), cy) - width;
        let maxtx = Math.max(Math.max(ax, bx), cx) + width;
        let maxty = Math.max(Math.max(ay, by), cy) + width;

        return VMath.inrect({x: px, y: py}, mintx, minty, maxtx-mintx, maxty-minty);
    },

    distanceToTriangle: function(px, py, ax, ay, bx, by, cx, cy)
    {
        let e0 = {x: bx - ax, y: by - ay};
        let e1 = {x: cx - bx, y: cy - by};
        let e2 = {x: ax - cx, y: ay - cy};

        let v0 = {x: px - ax, y: py - ay};
        let v1 = {x: px - bx, y: py - by};
        let v2 = {x: px - cx, y: py - cy};

        let pq = 0; 
        pq = Math.clamp( VMath.dot2d(v0, e0) / VMath.dot2d(e0, e0), 0, 1);
        let pq0 = {x: v0.x - e0.x * pq, y: v0.y - e0.y * pq};
        pq = Math.clamp( VMath.dot2d(v1, e1) / VMath.dot2d(e1, e1), 0, 1);
        let pq1 = {x: v1.x - e1.x * pq, y: v1.y - e1.y * pq};
        pq = Math.clamp( VMath.dot2d(v2, e2) / VMath.dot2d(e2, e2), 0, 1);
        let pq2 = {x: v2.x - e2.x * pq, y: v2.y - e2.y * pq};

        let s = Math.sign( e0.x*e2.y - e0.y*e2.x);
        // let s = 1;
        let d = VMath.min2d(
            VMath.min2d(
                {x: VMath.dot2d(pq0, pq0), y:s * (v0.x*e0.y-v0.y*e0.x)},
                {x: VMath.dot2d(pq1, pq1), y:s * (v1.x*e1.y-v1.y*e1.x)}
            ),
            {x: VMath.dot2d(pq2, pq2), y:s * (v2.x*e2.y-v2.y*e2.x)}
        );
        return -Math.sqrt(d.x) * Math.sign(d.y);
    },

    min2d : function(a, b)
    {
        return {
            x: Math.min(a.x, b.x),
            y: Math.min(a.y, b.y)
        };
    },

    lineVsLineOverlap : function(a, b, c, d)
    {
        let dx12 = b.x - a.x;
        let dy12 = b.y - a.y;
        let dx34 = d.x - c.x;
        let dy34 = d.y - c.y;
        let denom = (dy12 * dx34 - dx12 * dy34);
        let t1 = ((a.x - c.x) * dy34 + (c.y - a.y) * dx34) / denom;
        return Vector2(a.x + dx12 * t1, a.y + dy12 * t1);
    },

    linesIntersect: function(A, B, C, D)
    {
        return (this.ccw(A,C,D) != this.ccw(B,C,D) && this.ccw(A,B,C) != this.ccw(A,B,D));
    },

    ccw: function(A, B, C) {
        return ((C.y-A.y) * (B.x-A.x) > (B.y-A.y) * (C.x-A.x));
    }
};