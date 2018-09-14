function Winwheel(a, b) {
    defaultOptions = {
        canvasId: "canvas",
        centerX: null,
        centerY: null,
        outerRadius: null,
        innerRadius: 0,
        numSegments: 1,
        drawMode: "code",
        rotationAngle: 0,
        textFontFamily: "Arial",
        textFontSize: 20,
        textFontWeight: "bold",
        textOrientation: "horizontal",
        textAlignment: "center",
        textDirection: "normal",
        textMargin: null,
        textFillStyle: "black",
        textStrokeStyle: null,
        textLineWidth: 1,
        fillStyle: "silver",
        strokeStyle: "black",
        lineWidth: 1,
        clearTheCanvas: !0,
        imageOverlay: !1,
        drawText: !0,
        pointerAngle: 0,
        wheelImage: null,
        imageDirection: "N"
    };
    for (var c in defaultOptions)
        this[c] = null != a && "undefined" !== typeof a[c] ? a[c] : defaultOptions[c];
    if (null != a)
        for (c in a)
            "undefined" === typeof this[c] && (this[c] = a[c]);
    this.canvasId ? (this.canvas = document.getElementById(this.canvasId)) ? (null == this.centerX && (this.centerX = this.canvas.width / 2),
    null == this.centerY && (this.centerY = this.canvas.height / 2),
    null == this.outerRadius && (this.outerRadius = this.canvas.width < this.canvas.height ? this.canvas.width / 2 - this.lineWidth : this.canvas.height / 2 - this.lineWidth),
    this.ctx = this.canvas.getContext("2d")) : this.ctx = this.canvas = null : this.ctx = this.cavnas = null;
    this.segments = Array(null);
    for (x = 1; x <= this.numSegments; x++)
        this.segments[x] = null != a && a.segments && "undefined" !== typeof a.segments[x - 1] ? new Segment(a.segments[x - 1]) : new Segment;
    this.updateSegmentSizes();
    null === this.textMargin && (this.textMargin = this.textFontSize / 1.7);
    this.animation = null != a && a.animation && "undefined" !== typeof a.animation ? new Animation(a.animation) : new Animation;
    null != a && a.pins && "undefined" !== typeof a.pins && (this.pins = new Pin(a.pins));
    "image" == this.drawMode || "segmentImage" == this.drawMode ? ("undefined" === typeof a.fillStyle && (this.fillStyle = null),
    "undefined" === typeof a.strokeStyle && (this.strokeStyle = "red"),
    "undefined" === typeof a.drawText && (this.drawText = !1),
    "undefined" === typeof a.lineWidth && (this.lineWidth = 1),
    "undefined" === typeof b && (b = !1)) : "undefined" === typeof b && (b = !0);
    this.pointerGuide = null != a && a.pointerGuide && "undefined" !== typeof a.pointerGuide ? new PointerGuide(a.pointerGuide) : new PointerGuide;
    if (1 == b)
        this.draw(this.clearTheCanvas);
    else if ("segmentImage" == this.drawMode)
        for (winwheelToDrawDuringAnimation = this,
        winhweelAlreadyDrawn = !1,
        y = 1; y <= this.numSegments; y++)
            null !== this.segments[y].image && (this.segments[y].imgData = new Image,
            this.segments[y].imgData.onload = winwheelLoadedImage,
            this.segments[y].imgData.src = this.segments[y].image)
}
Winwheel.prototype.updateSegmentSizes = function() {
    if (this.segments) {
        var a = 0
          , b = 0;
        for (x = 1; x <= this.numSegments; x++)
            null !== this.segments[x].size && (a += this.segments[x].size,
            b++);
        var c = 360 - a;
        a = 0;
        0 < c && (a = c / (this.numSegments - b));
        b = 0;
        for (x = 1; x <= this.numSegments; x++)
            this.segments[x].startAngle = b,
            b = this.segments[x].size ? b + this.segments[x].size : b + a,
            this.segments[x].endAngle = b
    }
}
;
Winwheel.prototype.clearCanvas = function() {
    this.ctx && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
}
;
Winwheel.prototype.draw = function(a) {
    this.ctx && ("undefined" !== typeof a ? 1 == a && this.clearCanvas() : this.clearCanvas(),
    "image" == this.drawMode ? (this.drawWheelImage(),
    1 == this.drawText && this.drawSegmentText(),
    1 == this.imageOverlay && this.drawSegments()) : "segmentImage" == this.drawMode ? (this.drawSegmentImages(),
    1 == this.drawText && this.drawSegmentText(),
    1 == this.imageOverlay && this.drawSegments()) : (this.drawSegments(),
    1 == this.drawText && this.drawSegmentText()),
    "undefined" !== typeof this.pins && 1 == this.pins.visible && this.drawPins(),
    1 == this.pointerGuide.display && this.drawPointerGuide())
}
;
Winwheel.prototype.drawPins = function() {
    if (this.pins && this.pins.number) {
        var a = 360 / this.pins.number;
        for (i = 1; i <= this.pins.number; i++)
            this.ctx.save(),
            this.ctx.strokeStyle = this.pins.strokeStyle,
            this.ctx.lineWidth = this.pins.lineWidth,
            this.ctx.fillStyle = this.pins.fillStyle,
            this.ctx.translate(this.centerX, this.centerY),
            this.ctx.rotate(this.degToRad(i * a + this.rotationAngle)),
            this.ctx.translate(-this.centerX, -this.centerY),
            this.ctx.beginPath(),
            this.ctx.arc(this.centerX, this.centerY - this.outerRadius + this.pins.outerRadius + this.pins.margin, this.pins.outerRadius, 0, 2 * Math.PI),
            this.pins.fillStyle && this.ctx.fill(),
            this.pins.strokeStyle && this.ctx.stroke(),
            this.ctx.restore()
    }
}
;
Winwheel.prototype.drawPointerGuide = function() {
    this.ctx && (this.ctx.save(),
    this.ctx.translate(this.centerX, this.centerY),
    this.ctx.rotate(this.degToRad(this.pointerAngle)),
    this.ctx.translate(-this.centerX, -this.centerY),
    this.ctx.strokeStyle = this.pointerGuide.strokeStyle,
    this.ctx.lineWidth = this.pointerGuide.lineWidth,
    this.ctx.beginPath(),
    this.ctx.moveTo(this.centerX, this.centerY),
    this.ctx.lineTo(this.centerX, -(this.outerRadius / 4)),
    this.ctx.stroke(),
    this.ctx.restore())
}
;
Winwheel.prototype.drawWheelImage = function() {
    if (null != this.wheelImage) {
        var a = this.centerX - this.wheelImage.height / 2
          , b = this.centerY - this.wheelImage.width / 2;
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.degToRad(this.rotationAngle));
        this.ctx.translate(-this.centerX, -this.centerY);
        this.ctx.drawImage(this.wheelImage, a, b);
        this.ctx.restore()
    }
}
;
Winwheel.prototype.drawSegmentImages = function() {
    if (this.ctx && this.segments)
        for (x = 1; x <= this.numSegments; x++)
            if (seg = this.segments[x],
            seg.imgData.height) {
                var a = null !== seg.imageDirection ? seg.imageDirection : this.imageDirection;
                if ("S" == a) {
                    a = this.centerX - seg.imgData.width / 2;
                    var b = this.centerY;
                    var c = seg.startAngle + 180 + (seg.endAngle - seg.startAngle) / 2
                } else
                    "E" == a ? (a = this.centerX,
                    b = this.centerY - seg.imgData.height / 2,
                    c = seg.startAngle + 270 + (seg.endAngle - seg.startAngle) / 2) : "W" == a ? (a = this.centerX - seg.imgData.width,
                    b = this.centerY - seg.imgData.height / 2,
                    c = seg.startAngle + 90 + (seg.endAngle - seg.startAngle) / 2) : (a = this.centerX - seg.imgData.width / 2,
                    b = this.centerY - seg.imgData.height,
                    c = seg.startAngle + (seg.endAngle - seg.startAngle) / 2);
                this.ctx.save();
                this.ctx.translate(this.centerX, this.centerY);
                this.ctx.rotate(this.degToRad(this.rotationAngle + c));
                this.ctx.translate(-this.centerX, -this.centerY);
                this.ctx.drawImage(seg.imgData, a, b);
                this.ctx.restore()
            } else
                console.log("Segment " + x + " imgData is not loaded")
}
;
Winwheel.prototype.drawSegments = function() {
    if (this.ctx && this.segments)
        for (x = 1; x <= this.numSegments; x++) {
            seg = this.segments[x];
            var a = null !== seg.fillStyle ? seg.fillStyle : this.fillStyle;
            this.ctx.fillStyle = a;
            this.ctx.lineWidth = null !== seg.lineWidth ? seg.lineWidth : this.lineWidth;
            var b = null !== seg.strokeStyle ? seg.strokeStyle : this.strokeStyle;
            if ((this.ctx.strokeStyle = b) || a)
                this.ctx.beginPath(),
                this.innerRadius || this.ctx.moveTo(this.centerX, this.centerY),
                this.ctx.arc(this.centerX, this.centerY, this.outerRadius, this.degToRad(seg.startAngle + this.rotationAngle - 90), this.degToRad(seg.endAngle + this.rotationAngle - 90), !1),
                this.innerRadius ? this.ctx.arc(this.centerX, this.centerY, this.innerRadius, this.degToRad(seg.endAngle + this.rotationAngle - 90), this.degToRad(seg.startAngle + this.rotationAngle - 90), !0) : this.ctx.lineTo(this.centerX, this.centerY),
                a && this.ctx.fill(),
                b && this.ctx.stroke()
        }
}
;
Winwheel.prototype.drawSegmentText = function() {
    if (this.ctx)
        for (x = 1; x <= this.numSegments; x++) {
            this.ctx.save();
            seg = this.segments[x];
            if (seg.text) {
                var a = null !== seg.textFontFamily ? seg.textFontFamily : this.textFontFamily;
                var b = null !== seg.textFontSize ? seg.textFontSize : this.textFontSize;
                var c = null !== seg.textFontWeight ? seg.textFontWeight : this.textFontWeight;
                var k = null !== seg.textOrientation ? seg.textOrientation : this.textOrientation;
                var e = null !== seg.textAlignment ? seg.textAlignment : this.textAlignment;
                var q = null !== seg.textDirection ? seg.textDirection : this.textDirection;
                var f = null !== seg.textMargin ? seg.textMargin : this.textMargin;
                var l = null !== seg.textFillStyle ? seg.textFillStyle : this.textFillStyle;
                var m = null !== seg.textStrokeStyle ? seg.textStrokeStyle : this.textStrokeStyle;
                var d = null !== seg.textLineWidth ? seg.textLineWidth : this.textLineWidth;
                var g = "";
                null != c && (g += c + " ");
                null != b && (g += b + "px ");
                null != a && (g += a);
                this.ctx.font = g;
                this.ctx.fillStyle = l;
                this.ctx.strokeStyle = m;
                this.ctx.lineWidth = d;
                a = seg.text.split("\n");
                c = 0 - a.length / 2 * b + b / 2;
                "curved" != k || "inner" != e && "outer" != e || (c = 0);
                for (i = 0; i < a.length; i++) {
                    if ("reversed" == q)
                        if ("horizontal" == k)
                            this.ctx.textAlign = "inner" == e ? "right" : "outer" == e ? "left" : "center",
                            this.ctx.textBaseline = "middle",
                            d = this.degToRad(seg.endAngle - (seg.endAngle - seg.startAngle) / 2 + this.rotationAngle - 90 - 180),
                            this.ctx.save(),
                            this.ctx.translate(this.centerX, this.centerY),
                            this.ctx.rotate(d),
                            this.ctx.translate(-this.centerX, -this.centerY),
                            "inner" == e ? (l && this.ctx.fillText(a[i], this.centerX - this.innerRadius - f, this.centerY + c),
                            m && this.ctx.strokeText(a[i], this.centerX - this.innerRadius - f, this.centerY + c)) : "outer" == e ? (l && this.ctx.fillText(a[i], this.centerX - this.outerRadius + f, this.centerY + c),
                            m && this.ctx.strokeText(a[i], this.centerX - this.outerRadius + f, this.centerY + c)) : (l && this.ctx.fillText(a[i], this.centerX - this.innerRadius - (this.outerRadius - this.innerRadius) / 2 - f, this.centerY + c),
                            m && this.ctx.strokeText(a[i], this.centerX - this.innerRadius - (this.outerRadius - this.innerRadius) / 2 - f, this.centerY + c)),
                            this.ctx.restore();
                        else if ("vertical" == k) {
                            this.ctx.textAlign = "center";
                            this.ctx.textBaseline = "inner" == e ? "top" : "outer" == e ? "bottom" : "middle";
                            d = seg.endAngle - (seg.endAngle - seg.startAngle) / 2 - 180;
                            d += this.rotationAngle;
                            this.ctx.save();
                            this.ctx.translate(this.centerX, this.centerY);
                            this.ctx.rotate(this.degToRad(d));
                            this.ctx.translate(-this.centerX, -this.centerY);
                            if ("outer" == e)
                                var h = this.centerY + this.outerRadius - f;
                            else
                                "inner" == e && (h = this.centerY + this.innerRadius + f);
                            g = b - b / 9;
                            if ("outer" == e)
                                for (d = a[i].length - 1; 0 <= d; d--)
                                    character = a[i].charAt(d),
                                    l && this.ctx.fillText(character, this.centerX + c, h),
                                    m && this.ctx.strokeText(character, this.centerX + c, h),
                                    h -= g;
                            else if ("inner" == e)
                                for (d = 0; d < a[i].length; d++)
                                    character = a[i].charAt(d),
                                    l && this.ctx.fillText(character, this.centerX + c, h),
                                    m && this.ctx.strokeText(character, this.centerX + c, h),
                                    h += g;
                            else if ("center" == e)
                                for (h = 0,
                                1 < a[i].length && (h = g * (a[i].length - 1) / 2),
                                h = this.centerY + this.innerRadius + (this.outerRadius - this.innerRadius) / 2 + h + f,
                                d = a[i].length - 1; 0 <= d; d--)
                                    character = a[i].charAt(d),
                                    l && this.ctx.fillText(character, this.centerX + c, h),
                                    m && this.ctx.strokeText(character, this.centerX + c, h),
                                    h -= g;
                            this.ctx.restore()
                        } else {
                            if ("curved" == k) {
                                g = 0;
                                "inner" == e ? (g = this.innerRadius + f,
                                this.ctx.textBaseline = "top") : "outer" == e ? (g = this.outerRadius - f,
                                this.ctx.textBaseline = "bottom",
                                g -= b * (a.length - 1)) : "center" == e && (g = this.innerRadius + f + (this.outerRadius - this.innerRadius) / 2,
                                this.ctx.textBaseline = "middle");
                                var p = 0;
                                if (1 < a[i].length) {
                                    this.ctx.textAlign = "left";
                                    p = b / 10 * 4;
                                    radiusPercent = 100 / g;
                                    p *= radiusPercent;
                                    totalArc = p * a[i].length;
                                    var n = seg.startAngle + ((seg.endAngle - seg.startAngle) / 2 - totalArc / 2)
                                } else
                                    n = seg.startAngle + (seg.endAngle - seg.startAngle) / 2,
                                    this.ctx.textAlign = "center";
                                n += this.rotationAngle;
                                n -= 180;
                                for (d = a[i].length; 0 <= d; d--)
                                    this.ctx.save(),
                                    character = a[i].charAt(d),
                                    this.ctx.translate(this.centerX, this.centerY),
                                    this.ctx.rotate(this.degToRad(n)),
                                    this.ctx.translate(-this.centerX, -this.centerY),
                                    m && this.ctx.strokeText(character, this.centerX, this.centerY + g + c),
                                    l && this.ctx.fillText(character, this.centerX, this.centerY + g + c),
                                    n += p,
                                    this.ctx.restore()
                            }
                        }
                    else if ("horizontal" == k)
                        this.ctx.textAlign = "inner" == e ? "left" : "outer" == e ? "right" : "center",
                        this.ctx.textBaseline = "middle",
                        d = this.degToRad(seg.endAngle - (seg.endAngle - seg.startAngle) / 2 + this.rotationAngle - 90),
                        this.ctx.save(),
                        this.ctx.translate(this.centerX, this.centerY),
                        this.ctx.rotate(d),
                        this.ctx.translate(-this.centerX, -this.centerY),
                        "inner" == e ? (l && this.ctx.fillText(a[i], this.centerX + this.innerRadius + f, this.centerY + c),
                        m && this.ctx.strokeText(a[i], this.centerX + this.innerRadius + f, this.centerY + c)) : "outer" == e ? (l && this.ctx.fillText(a[i], this.centerX + this.outerRadius - f, this.centerY + c),
                        m && this.ctx.strokeText(a[i], this.centerX + this.outerRadius - f, this.centerY + c)) : (l && this.ctx.fillText(a[i], this.centerX + this.innerRadius + (this.outerRadius - this.innerRadius) / 2 + f, this.centerY + c),
                        m && this.ctx.strokeText(a[i], this.centerX + this.innerRadius + (this.outerRadius - this.innerRadius) / 2 + f, this.centerY + c)),
                        this.ctx.restore();
                    else if ("vertical" == k) {
                        this.ctx.textAlign = "center";
                        this.ctx.textBaseline = "inner" == e ? "bottom" : "outer" == e ? "top" : "middle";
                        d = seg.endAngle - (seg.endAngle - seg.startAngle) / 2;
                        d += this.rotationAngle;
                        this.ctx.save();
                        this.ctx.translate(this.centerX, this.centerY);
                        this.ctx.rotate(this.degToRad(d));
                        this.ctx.translate(-this.centerX, -this.centerY);
                        "outer" == e ? h = this.centerY - this.outerRadius + f : "inner" == e && (h = this.centerY - this.innerRadius - f);
                        g = b - b / 9;
                        if ("outer" == e)
                            for (d = 0; d < a[i].length; d++)
                                character = a[i].charAt(d),
                                l && this.ctx.fillText(character, this.centerX + c, h),
                                m && this.ctx.strokeText(character, this.centerX + c, h),
                                h += g;
                        else if ("inner" == e)
                            for (d = a[i].length - 1; 0 <= d; d--)
                                character = a[i].charAt(d),
                                l && this.ctx.fillText(character, this.centerX + c, h),
                                m && this.ctx.strokeText(character, this.centerX + c, h),
                                h -= g;
                        else if ("center" == e)
                            for (h = 0,
                            1 < a[i].length && (h = g * (a[i].length - 1) / 2),
                            h = this.centerY - this.innerRadius - (this.outerRadius - this.innerRadius) / 2 - h - f,
                            d = 0; d < a[i].length; d++)
                                character = a[i].charAt(d),
                                l && this.ctx.fillText(character, this.centerX + c, h),
                                m && this.ctx.strokeText(character, this.centerX + c, h),
                                h += g;
                        this.ctx.restore()
                    } else if ("curved" == k)
                        for (g = 0,
                        "inner" == e ? (g = this.innerRadius + f,
                        this.ctx.textBaseline = "bottom",
                        g += b * (a.length - 1)) : "outer" == e ? (g = this.outerRadius - f,
                        this.ctx.textBaseline = "top") : "center" == e && (g = this.innerRadius + f + (this.outerRadius - this.innerRadius) / 2,
                        this.ctx.textBaseline = "middle"),
                        p = 0,
                        1 < a[i].length ? (this.ctx.textAlign = "left",
                        p = b / 10 * 4,
                        radiusPercent = 100 / g,
                        p *= radiusPercent,
                        totalArc = p * a[i].length,
                        n = seg.startAngle + ((seg.endAngle - seg.startAngle) / 2 - totalArc / 2)) : (n = seg.startAngle + (seg.endAngle - seg.startAngle) / 2,
                        this.ctx.textAlign = "center"),
                        n += this.rotationAngle,
                        d = 0; d < a[i].length; d++)
                            this.ctx.save(),
                            character = a[i].charAt(d),
                            this.ctx.translate(this.centerX, this.centerY),
                            this.ctx.rotate(this.degToRad(n)),
                            this.ctx.translate(-this.centerX, -this.centerY),
                            m && this.ctx.strokeText(character, this.centerX, this.centerY - g + c),
                            l && this.ctx.fillText(character, this.centerX, this.centerY - g + c),
                            n += p,
                            this.ctx.restore();
                    c += b
                }
            }
            this.ctx.restore()
        }
}
;
Winwheel.prototype.degToRad = function(a) {
    return .017453292519943295 * a
}
;
Winwheel.prototype.setCenter = function(a, b) {
    this.centerX = a;
    this.centerY = b
}
;
Winwheel.prototype.addSegment = function(a, b) {
    newSegment = new Segment(a);
    this.numSegments++;
    var c;
    if ("undefined" !== typeof b) {
        for (c = this.numSegments; c > b; c--)
            this.segments[c] = this.segments[c - 1];
        this.segments[b] = newSegment;
        c = b
    } else
        this.segments[this.numSegments] = newSegment,
        c = this.numSegments;
    this.updateSegmentSizes();
    return this.segments[c]
}
;
Winwheel.prototype.setCanvasId = function(a) {
    if (a) {
        if (this.canvasId = a,
        this.canvas = document.getElementById(this.canvasId))
            this.ctx = this.canvas.getContext("2d")
    } else
        this.canvas = this.ctx = this.canvasId = null
}
;
Winwheel.prototype.deleteSegment = function(a) {
    if (1 < this.numSegments) {
        if ("undefined" !== typeof a)
            for (; a < this.numSegments; a++)
                this.segments[a] = this.segments[a + 1];
        this.segments[this.numSegments] = void 0;
        this.numSegments--;
        this.updateSegmentSizes()
    }
}
;
Winwheel.prototype.windowToCanvas = function(a, b) {
    var c = this.canvas.getBoundingClientRect();
    return {
        x: Math.floor(a - this.canvas.width / c.width * c.left),
        y: Math.floor(b - this.canvas.height / c.height * c.top)
    }
}
;
Winwheel.prototype.getSegmentAt = function(a, b) {
    var c = null
      , k = this.getSegmentNumberAt(a, b);
    null !== k && (c = this.segments[k]);
    return c
}
;
Winwheel.prototype.getSegmentNumberAt = function(a, b) {
    var c = this.windowToCanvas(a, b);
    if (c.x > this.centerX) {
        var k = c.x - this.centerX;
        var e = "R"
    } else
        k = this.centerX - c.x,
        e = "L";
    if (c.y > this.centerY) {
        var q = c.y - this.centerY;
        var f = "B"
    } else
        q = this.centerY - c.y,
        f = "T";
    var l = 180 * Math.atan(q / k) / Math.PI;
    c = 0;
    k = Math.sqrt(q * q + k * k);
    "T" == f && "R" == e ? c = Math.round(90 - l) : "B" == f && "R" == e ? c = Math.round(l + 90) : "B" == f && "L" == e ? c = Math.round(90 - l + 180) : "T" == f && "L" == e && (c = Math.round(l + 270));
    0 != this.rotationAngle && (e = this.getRotationPosition(),
    c -= e,
    0 > c && (c = 360 - Math.abs(c)));
    e = null;
    for (a = 1; a <= this.numSegments; a++)
        if (c >= this.segments[a].startAngle && c <= this.segments[a].endAngle && k >= this.innerRadius && k <= this.outerRadius) {
            e = a;
            break
        }
    return e
}
;
Winwheel.prototype.getIndicatedSegment = function() {
    var a = this.getIndicatedSegmentNumber();
    return this.segments[a]
}
;
Winwheel.prototype.getIndicatedSegmentNumber = function() {
    var a = 0
      , b = this.getRotationPosition();
    b = Math.floor(this.pointerAngle - b);
    0 > b && (b = 360 - Math.abs(b));
    for (x = 1; x < this.segments.length; x++)
        if (b >= this.segments[x].startAngle && b <= this.segments[x].endAngle) {
            a = x;
            break
        }
    return a
}
;
Winwheel.prototype.getCurrentPinNumber = function() {
    var a = 0;
    if (this.pins) {
        var b = this.getRotationPosition();
        b = Math.floor(this.pointerAngle - b);
        0 > b && (b = 360 - Math.abs(b));
        var c = 360 / this.pins.number
          , k = 0;
        for (x = 0; x < this.pins.number; x++) {
            if (b >= k && b <= k + c) {
                a = x;
                break
            }
            k += c
        }
        "clockwise" == this.animation.direction && (a++,
        a > this.pins.number && (a = 0))
    }
    return a
}
;
Winwheel.prototype.getRotationPosition = function() {
    var a = this.rotationAngle;
    if (0 <= a) {
        if (360 < a) {
            var b = Math.floor(a / 360);
            a -= 360 * b
        }
    } else
        -360 > a && (b = Math.ceil(a / 360),
        a -= 360 * b),
        a = 360 + a;
    return a
}
;
Winwheel.prototype.startAnimation = function() {
    if (this.animation) {
        this.computeAnimation();
        winwheelToDrawDuringAnimation = this;
        var a = Array(null);
        a[this.animation.propertyName] = this.animation.propertyValue;
        a.yoyo = this.animation.yoyo;
        a.repeat = this.animation.repeat;
        a.ease = this.animation.easing;
        a.onUpdate = winwheelAnimationLoop;
        a.onComplete = winwheelStopAnimation;
        this.tween = TweenMax.to(this, this.animation.duration, a)
    }
}
;
Winwheel.prototype.stopAnimation = function(a) {
    winwheelToDrawDuringAnimation && (winwheelToDrawDuringAnimation.tween.kill(),
    winwheelStopAnimation(a));
    winwheelToDrawDuringAnimation = this
}
;
Winwheel.prototype.pauseAnimation = function() {
    this.tween && this.tween.pause()
}
;
Winwheel.prototype.resumeAnimation = function() {
    this.tween && this.tween.play()
}
;
Winwheel.prototype.computeAnimation = function() {
    this.animation && ("spinOngoing" == this.animation.type ? (this.animation.propertyName = "rotationAngle",
    null == this.animation.spins && (this.animation.spins = 5),
    null == this.animation.repeat && (this.animation.repeat = -1),
    null == this.animation.easing && (this.animation.easing = "Linear.easeNone"),
    null == this.animation.yoyo && (this.animation.yoyo = !1),
    this.animation.propertyValue = 360 * this.animation.spins,
    "anti-clockwise" == this.animation.direction && (this.animation.propertyValue = 0 - this.animation.propertyValue)) : "spinToStop" == this.animation.type ? (this.animation.propertyName = "rotationAngle",
    null == this.animation.spins && (this.animation.spins = 5),
    null == this.animation.repeat && (this.animation.repeat = 0),
    null == this.animation.easing && (this.animation.easing = "Power3.easeOut"),
    this.animation._stopAngle = null == this.animation.stopAngle ? Math.floor(359 * Math.random()) : 360 - this.animation.stopAngle + this.pointerAngle,
    null == this.animation.yoyo && (this.animation.yoyo = !1),
    this.animation.propertyValue = 360 * this.animation.spins,
    "anti-clockwise" == this.animation.direction ? (this.animation.propertyValue = 0 - this.animation.propertyValue,
    this.animation.propertyValue -= 360 - this.animation._stopAngle) : this.animation.propertyValue += this.animation._stopAngle) : "spinAndBack" == this.animation.type && (this.animation.propertyName = "rotationAngle",
    null == this.animation.spins && (this.animation.spins = 5),
    null == this.animation.repeat && (this.animation.repeat = 1),
    null == this.animation.easing && (this.animation.easing = "Power2.easeInOut"),
    null == this.animation.yoyo && (this.animation.yoyo = !0),
    this.animation._stopAngle = null == this.animation.stopAngle ? 0 : 360 - this.animation.stopAngle,
    this.animation.propertyValue = 360 * this.animation.spins,
    "anti-clockwise" == this.animation.direction ? (this.animation.propertyValue = 0 - this.animation.propertyValue,
    this.animation.propertyValue -= 360 - this.animation._stopAngle) : this.animation.propertyValue += this.animation._stopAngle))
}
;
Winwheel.prototype.getRandomForSegment = function(a) {
    var b = 0;
    if (a)
        if ("undefined" !== typeof this.segments[a]) {
            var c = this.segments[a].startAngle;
            a = this.segments[a].endAngle - c - 2;
            0 < a ? b = c + 1 + Math.floor(Math.random() * a) : console.log("Segment size is too small to safely get random angle inside it")
        } else
            console.log("Segment " + a + " undefined");
    else
        console.log("Segment number not specified");
    return b
}
;
function Pin(a) {
    defaultOptions = {
        visible: !0,
        number: 36,
        outerRadius: 3,
        fillStyle: "grey",
        strokeStyle: "black",
        lineWidth: 1,
        margin: 3
    };
    for (var b in defaultOptions)
        this[b] = null != a && "undefined" !== typeof a[b] ? a[b] : defaultOptions[b];
    if (null != a)
        for (b in a)
            "undefined" === typeof this[b] && (this[b] = a[b])
}
function Animation(a) {
    defaultOptions = {
        type: "spinOngoing",
        direction: "clockwise",
        propertyName: null,
        propertyValue: null,
        duration: 10,
        yoyo: !1,
        repeat: null,
        easing: null,
        stopAngle: null,
        spins: null,
        clearTheCanvas: null,
        callbackFinished: null,
        callbackBefore: null,
        callbackAfter: null,
        callbackSound: null,
        soundTrigger: "segment"
    };
    for (var b in defaultOptions)
        this[b] = null != a && "undefined" !== typeof a[b] ? a[b] : defaultOptions[b];
    if (null != a)
        for (b in a)
            "undefined" === typeof this[b] && (this[b] = a[b])
}
function Segment(a) {
    defaultOptions = {
        size: null,
        text: "",
        fillStyle: null,
        strokeStyle: null,
        lineWidth: null,
        textFontFamily: null,
        textFontSize: null,
        textFontWeight: null,
        textOrientation: null,
        textAlignment: null,
        textDirection: null,
        textMargin: null,
        textFillStyle: null,
        textStrokeStyle: null,
        textLineWidth: null,
        image: null,
        imageDirection: null,
        imgData: null
    };
    for (var b in defaultOptions)
        this[b] = null != a && "undefined" !== typeof a[b] ? a[b] : defaultOptions[b];
    if (null != a)
        for (b in a)
            "undefined" === typeof this[b] && (this[b] = a[b]);
    this.endAngle = this.startAngle = 0
}
Segment.prototype.changeImage = function(a, b) {
    this.image = a;
    this.imgData = null;
    b && (this.imageDirection = b);
    winhweelAlreadyDrawn = !1;
    this.imgData = new Image;
    this.imgData.onload = winwheelLoadedImage;
    this.imgData.src = this.image
}
;
function PointerGuide(a) {
    defaultOptions = {
        display: !1,
        strokeStyle: "red",
        lineWidth: 3
    };
    for (var b in defaultOptions)
        this[b] = null != a && "undefined" !== typeof a[b] ? a[b] : defaultOptions[b]
}
function winwheelPercentToDegrees(a) {
    var b = 0;
    0 < a && 100 >= a && (b = a / 100 * 360);
    return b
}
function winwheelAnimationLoop() {
    if (winwheelToDrawDuringAnimation) {
        0 != winwheelToDrawDuringAnimation.animation.clearTheCanvas && winwheelToDrawDuringAnimation.ctx.clearRect(0, 0, winwheelToDrawDuringAnimation.canvas.width, winwheelToDrawDuringAnimation.canvas.height);
        var a = winwheelToDrawDuringAnimation.animation.callbackBefore
          , b = winwheelToDrawDuringAnimation.animation.callbackAfter;
        null != a && ("function" === typeof a ? a() : eval(a));
        winwheelToDrawDuringAnimation.draw(!1);
        null != b && ("function" === typeof b ? b() : eval(b));
        winwheelToDrawDuringAnimation.animation.callbackSound && winwheelTriggerSound()
    }
}
function winwheelTriggerSound() {
    0 == winwheelToDrawDuringAnimation.hasOwnProperty("_lastSoundTriggerNumber") && (winwheelToDrawDuringAnimation._lastSoundTriggerNumber = 0);
    var a = winwheelToDrawDuringAnimation.animation.callbackSound;
    var b = "pin" == winwheelToDrawDuringAnimation.animation.soundTrigger ? winwheelToDrawDuringAnimation.getCurrentPinNumber() : winwheelToDrawDuringAnimation.getIndicatedSegmentNumber();
    b != winwheelToDrawDuringAnimation._lastSoundTriggerNumber && ("function" === typeof a ? a() : eval(a),
    winwheelToDrawDuringAnimation._lastSoundTriggerNumber = b)
}
var winwheelToDrawDuringAnimation = null;
function winwheelStopAnimation(a) {
    0 != a && (a = winwheelToDrawDuringAnimation.animation.callbackFinished,
    null != a && ("function" === typeof a ? a(winwheelToDrawDuringAnimation.getIndicatedSegment()) : eval(a)))
}
var winhweelAlreadyDrawn = !1;
function winwheelLoadedImage() {
    if (0 == winhweelAlreadyDrawn) {
        var a = 0;
        for (i = 1; i <= winwheelToDrawDuringAnimation.numSegments; i++)
            null != winwheelToDrawDuringAnimation.segments[i].imgData && winwheelToDrawDuringAnimation.segments[i].imgData.height && a++;
        a == winwheelToDrawDuringAnimation.numSegments && (winhweelAlreadyDrawn = !0,
        winwheelToDrawDuringAnimation.draw())
    }
}
;
