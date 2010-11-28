// canvas
(function (global) {
    var canvas = document.createElement('canvas');
    if (!canvas.getContext('2d')) throw "No canvas available! Fail quickly"

    function vectorToCanvas(canvas) {
        return function (vector) {
            return [vector[0], canvas.height - vector[1]];
        }
    }

    global.canvasWrapper = function (id) {
        var cvs = document.getElementById(id);
        var ctx = cvs.getContext('2d');
        var vtc = vectorToCanvas(cvs);

        return {
            ele: cvs,
            drawShape: function (lines) {
                var i=0, l=lines.length, line;
                ctx.strokeStyle = "#000"

                for (i; i<l; i++) {
                    line = lines[i];
                    ctx.moveTo.apply(ctx, vtc(lines[i][0]));
                    ctx.lineTo.apply(ctx, vtc(lines[i][1]));
                }

                ctx.stroke()
            },
            drawToDimensions: function (fun) {
                this.drawShape(fun([0,0],[this.ele.width,0],[0, this.ele.height]));
            }
        }
    }
})(window);
