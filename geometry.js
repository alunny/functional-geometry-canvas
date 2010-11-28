// geometry
(function (global) {
    var undefined;
    
    function argsToArray(args) {
        return Array.prototype.slice.call(args);
    }

    var v = {
        multiply: function (v, factor) {
            return [(v[0] * factor), (v[1] * factor)];
        },
        divide: function (v, divisor) {
            return [(v[0] / divisor), (v[1] / divisor)];
        },
        add: function (v1, v2) {
            var args, i, l, x, y;

            if (v1 == undefined) 
                return [0, 0];
            else if (v2 == undefined)
                return v1;
            else {
                args = argsToArray(arguments);
                l = args.length;
                x = v1[0];
                y = v1[1];

                for (i = 1; i < l; i++) {
                    x += args[i][0];
                    y += args[i][1];
                }

                return [x, y];
            }
        },
        minus: function (v1, v2) {
            var args, i, l, x, y;

            if (v1 == undefined) 
                return [0, 0];
            else if (v2 == undefined)
                return v.multiply(v1, -1);
            else {
                args = argsToArray(arguments);
                l = args.length;
                x = v1[0];
                y = v1[1];

                for (i = 1; i < l; i++) {
                    x -= args[i][0];
                    y -= args[i][1];
                }

                return [x, y];
            }
        }
    };

    function grid(width, height, lineSegments) {
        return function (offsetVector, boxWidth, boxHeight) {
            var l = lineSegments.length;
            var newList = [];
            var i, line;

            for (i = 0; i < l; i++) {
                line = lineSegments[i];
                newList.push([
                    v.add.apply(null, [
                        v.divide(v.multiply(boxWidth, line[0][0]), width),
                        offsetVector,
                        v.divide(v.multiply(boxHeight, line[0][1]), height)
                    ]),
                    v.add.apply(null, [
                        v.divide(v.multiply(boxWidth, line[1][0]), width),
                        offsetVector,
                        v.divide(v.multiply(boxHeight, line[1][1]), height)
                    ])
                ])
            }

            return newList;
        }
    }

    // convert list of points to list of lines
    function polygon(pointsList) {
        var i = 0;
        var l = pointsList.length;
        var listOfLines = [];

        for (i; i < l; i++) {
            if (i+1 == l)
                listOfLines.push([pointsList[i], pointsList[0]]);
            else
                listOfLines.push([pointsList[i], pointsList[i+1]]);
        }

        return listOfLines;
    }

    var transforms = {
        beside: function (p, q) {
            return function (a, b, c) {
                var halfWidth = v.divide(b, 2);
                return p(a, halfWidth, c).concat(q(v.add(a, halfWidth), halfWidth, c));
            }
        },
        above: function (p, q) {
            return function (a, b, c) {
                var halfHeight = v.divide(c, 2);
                return p(a, b, halfHeight).concat(q(v.add(a, halfHeight), b, halfHeight));
            }
        },
        rot: function (p) {
            return function (a, b, c) {
                return p(v.add(a, b), c, v.minus( b));
            }
        },
        quartet: function (p, q, r, s) {
            return this.above(this.beside(p, q), this.beside(r, s));
        },
        cycle: function (p) {
            return this.quartet(p, this.rot(this.rot(this.rot(p))), 
                    this.rot(p), this.rot(this.rot(p)));
        }
    }

    global.vMath = v;
    global.fGeo = {
        grid: grid,
        polygon: polygon
    }

    for (var i in transforms) {
        if (transforms.hasOwnProperty(i)) {
            global.fGeo[i] = transforms[i];
        }
    }
})(window);

// fishes
(function (global) {
    var blank = function (a, b, c) {
        return [];
    };

    var p = fGeo.grid(16, 16, [
        [[4, 4], [6, 0]], [[0, 3], [3, 4]], [[3, 4], [0, 8]],
        [[0, 8], [0, 3]], [[4, 5], [7, 6]], [[7, 6], [4, 10]],
        [[4, 10], [4, 5]], [[4, 13], [0, 16]], [[10, 4], [8, 8]],
        [[8, 8], [4, 13]], [[4, 13], [0, 16]], [[11, 0], [14, 2]],
        [[14, 2], [16, 2]], [[10, 4], [13, 5]], [[13, 5], [16, 4]],
        [[9, 6], [12, 7]], [[12, 7], [16, 6]], [[8, 8], [12, 9]],
        [[12, 9], [16, 8]], [[8, 12], [16, 10]], [[0, 16], [6, 15]],
        [[6, 15], [8, 16]], [[8, 16], [12, 12]], [[12, 12], [16, 12]],
        [[10, 16], [12, 14]], [[12, 14], [16, 13]], [[12, 16], [13, 15]],
        [[13, 15], [16, 14]], [[14, 16], [16, 15]]
    ]);

    var q = fGeo.grid(16, 16, [
        [[2, 0], [4, 5]], [[4, 5], [4, 7]], [[4, 0], [6, 5]],
        [[6, 5], [6, 7]], [[6, 0], [8, 5]], [[8, 5], [8, 8]],
        [[8, 0], [10, 6]], [[10, 6], [10, 9]], [[10, 0], [14, 11]],
        [[12, 0], [13, 4]], [[13, 4], [16, 8]], [[16, 8], [15, 10]],
        [[15, 10], [16, 16]], [[16, 16], [12, 10]], [[12, 10], [6, 7]],
        [[6, 7], [4, 7]], [[4, 7], [0, 8]], [[13, 0], [16, 6]],
        [[14, 0], [16, 4]], [[15, 0], [16, 2]], [[0, 10], [7, 11]],
        [[9, 12], [10, 10]], [[10, 10], [12, 12]], [[12, 12], [9, 12]],
        [[8, 15], [9, 13]], [[9, 13], [11, 15]], [[11, 15], [8, 15]],
        [[0, 12], [3, 13]], [[3, 13], [7, 15]], [[7, 15], [8, 16]],
        [[2, 16], [3, 13]], [[4, 16], [5, 14]], [[6, 16], [7, 15]]
    ]);

    var r = fGeo.grid(16, 16, [
        [[0, 12], [1, 14]], [[0, 8], [2, 12]], [[0, 4], [5, 10]],
        [[0, 0], [8, 8]], [[1, 1], [4, 0]], [[2, 2], [8, 0]],
        [[3, 3], [8, 2]], [[8, 2], [12, 0]], [[5, 5], [12, 3]],
        [[12, 3], [16, 0]], [[0, 16], [2, 12]], [[2, 12], [8, 8]],
        [[8, 8], [14, 6]], [[14, 6], [16, 4]], [[6, 16], [11, 10]],
        [[11, 10], [16, 6]], [[11, 16], [12, 12]], [[12, 12], [16, 8]],
        [[12, 12], [16, 16]], [[13, 13], [16, 10]], [[14, 14], [16, 12]],
        [[15, 15], [16, 14]]
    ]);

    var s = fGeo.grid(16, 16, [
        [[0, 0], [4, 2]], [[4, 2], [8, 2]], [[8, 2], [16, 0]],
        [[0, 4], [2, 1]], [[0, 6], [7, 4]], [[0, 8], [8, 6]],
        [[0, 10], [7, 8]], [[0, 12], [7, 10]], [[0, 14], [7, 13]],
        [[8, 16], [7, 13]], [[7, 13], [7, 8]], [[7, 8], [8, 6]],
        [[8, 6], [10, 4]], [[10, 4], [16, 0]], [[10, 16], [11, 10]],
        [[10, 6], [12, 4]], [[12, 4], [12, 7]], [[12, 7], [10, 6]],
        [[13, 7], [15, 5]], [[15, 5], [15, 8]], [[15, 8], [13, 7]],
        [[12, 16], [13, 13]], [[13, 13], [15, 9]], [[15, 9], [16, 8]],
        [[13, 13], [16, 14]], [[14, 11], [16, 12]], [[15, 9], [16, 10]]
    ]);

    var t = fGeo.quartet(p, q, r, s);
    var u = fGeo.cycle(fGeo.rot(q));

    var side1 = fGeo.quartet(blank, blank, fGeo.rot(t), t);
    var side2 = fGeo.quartet(side1, side1, fGeo.rot(t), t);

    var corner1 = fGeo.quartet(blank, blank, blank, u);
    var corner2 = fGeo.quartet(corner1, side1, fGeo.rot(side1), u);
    var pseudocorner = fGeo.quartet(corner1, side2, fGeo.rot(side2), fGeo.rot(t));

    var fishes = fGeo.cycle(pseudocorner);

    global.fishes = fishes;
})(window);

// canvas
(function (global) {
    var canvas = document.createElement('canvas');
    if (!canvas.getContext('2d')) throw "No canvas available! Fail quickly"

    function vectorToCanvas(canvas) {
        return function (vector) {
            return [vector[0], canvas.height - vector[1]];
        }
    }

    global.document.addEventListener("DOMContentLoaded", function () {
        var cvs = document.getElementById("geometric_canvas");
        var ctx = cvs.getContext('2d');
        var vtc = vectorToCanvas(cvs);

        global.drawShape = function (lines) {
            var i=0, l=lines.length, line;
            ctx.strokeStyle = "#000"

            for (i; i<l; i++) {
                line = lines[i];
                ctx.moveTo.apply(ctx, vtc(lines[i][0]));
                ctx.lineTo.apply(ctx, vtc(lines[i][1]));
                ctx.stroke()
            }
        }
    });
})(window);

var manLines = fGeo.polygon([
    [6, 10], [0, 10], [0, 12], [6, 12], [6, 14],
    [4, 16], [4, 18], [6, 20], [8, 20], [10, 18],
    [10, 16], [8, 14], [8, 12], [10, 12], [10, 14],
    [12, 14], [12, 10], [8, 10], [8, 8], [10, 0],
    [8, 0], [7, 4], [6, 0], [4, 0], [6, 8]
]);

var man = fGeo.grid(14, 20, manLines);

function drawALine () {
    var cnvas = document.getElementById("geometric_canvas");
    var ctx = cnvas.getContext('2d');

    ctx.moveTo(0,0);
    ctx.lineTo(0,30);
    ctx.lineTo(45,30);
    ctx.lineTo(20, 68);

    ctx.strokeStyle = "#000";
    ctx.stroke();
}
