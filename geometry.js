// geometry
(function (global) {
    var undefined;
    
    function argsToArray(args) {
        return Array.prototype.slice.call(args);
    }

    var vectorMath = {
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
                return vectorMath.multiply(v1, -1);
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
            var v = vectorMath;
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

    function beside(p, q) {
        return function (a, b, c) {
            var v = vectorMath;
            var halfWidth = v.divide(b, 2);
            return p(a, halfWidth, c).concat(q(v.add(a, halfWidth), halfWidth, c));
        }
    }

    global.vMath = vectorMath;
    global.functionalGeometry = {
        grid: grid,
        beside: beside,
        polygon: polygon
    }
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

var manLines = functionalGeometry.polygon([
    [6, 10], [0, 10], [0, 12], [6, 12], [6, 14],
    [4, 16], [4, 18], [6, 20], [8, 20], [10, 18],
    [10, 16], [8, 14], [8, 12], [10, 12], [10, 14],
    [12, 14], [12, 10], [8, 10], [8, 8], [10, 0],
    [8, 0], [7, 4], [6, 0], [4, 0], [6, 8]
]);

var man = functionalGeometry.grid(20, 14, manLines);

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
