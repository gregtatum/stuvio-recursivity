(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

var Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

Vector2.prototype = {

	constructor: Vector2,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},


	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( "index is out of range: " + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( "index is out of range: " + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'DEPRECATED: Vector2\'s .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'DEPRECATED: Vector2\'s .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		return this;

	},

	negate: function() {

		return this.multiplyScalar( - 1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	equals: function( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	fromArray: function ( array ) {

		this.x = array[ 0 ];
		this.y = array[ 1 ];

		return this;

	},

	toArray: function () {

		return [ this.x, this.y ];

	},

	clone: function () {

		return new Vector2( this.x, this.y );

	}

};

module.exports = Vector2;
},{}],2:[function(require,module,exports){
var Vector2 = require('../dependancies/Vector2')
var hslToFillStyle = require('./utils/hsl-to-fillstyle')

var BezierCurveFromLine = function(line, smoothness) {
	
	//Control point naming assumes left to right for semantic meaning only
	//Bezier curves can be any direction
	
	this.line = undefined
	this.cpLeft = undefined
	this.cpRight = undefined
	this.smoothnes = undefined
	this.distance = undefined
	
	if(_.isArray(line) && _.isNumber(smoothness)) {
		
		this.generate(line, smoothness)
	}
}

BezierCurveFromLine.prototype = {
	
	generate : function( line, smoothness ) {
		
		var i, il,
			p1, p2, p3,
			distance,
			totalDistance = 0,
			distances = [],
			theta,
			cpLeft = [],
			cpRight = []
		
		//Generate distances
		for(i=1, il=line.length; i < il; i++) {
			distance = Math.sqrt(
				Math.pow( line[i-1].x - line[i].x, 2) +
				Math.pow( line[i-1].y - line[i].y, 2)
			)
			distances.push( distance )
			this.distance += distance
		}
		
		//Add a beginning control point
		cpLeft.push( new Vector2().copy(line[0]) )
		cpRight.push( new Vector2().copy(line[0]) )
		
		//Generate control points
		for(i=1, il=line.length - 1; i < il; i++) {
			
			p1 = line[i-1]
			p2 = line[i]
			p3 = line[i+1]
			
			d1 = distances[i-1]
			d2 = distances[i]
			
			theta = Math.atan2(
				p3.y - p1.y,
				p3.x - p1.x
			)
			
			cpLeft.push( new Vector2(
				p2.x + ( d1 * smoothness ) * Math.cos( theta + Math.PI ),
				p2.y + ( d1 * smoothness ) * Math.sin( theta + Math.PI )
			))
			
			cpRight.push( new Vector2(
				p2.x + ( d2 * smoothness ) * Math.cos( theta ),
				p2.y + ( d2 * smoothness ) * Math.sin( theta )
			))
		}
		
		//Add an ending control point
		cpLeft.push( new Vector2().copy(line[ line.length - 1 ]) )
		cpRight.push( new Vector2().copy(line[ line.length - 1 ]) )
		
		this.line = line
		this.cpLeft = cpLeft
		this.cpRight = cpRight
		this.smoothnes = smoothness
		this.distance = totalDistance
	},
	
	regenerate : function() {
		this.generateBezier( this.line, this.smoothness )
	},
	
	createBezierPath : function( ctx ) {

		var i, il = this.line.length
		
		ctx.moveTo(line[0].x, line[0].y)
	
		for(i=1; i < il; i++) {
			ctx.bezierCurveTo(
				this.cpRight[i-1].x, this.cpRight[i-1].y,
				this.cpLeft[i].x, this.cpLeft[i].y,
				this.line[i].x, this.line[i].y
			)
		}
	},
	
	drawCurve : function( ctx ) {
		
		ctx.lineWidth = 3
		ctx.strokeStyle = hslToFillStyle(0, 50, 50, 0.5)
		ctx.beginPath()
		ctx.lineCap = "round"
		
		this.createBezierPath( ctx )
		
		ctx.stroke()
		ctx.closePath()
		
	},
	
	drawControlPoints : function( ctx ) {
		
		ctx.lineCap = "round"
		
		for(var i=0; i < this.cpLeft.length; i++) {

			ctx.lineWidth = 1
			
			ctx.beginPath()
			ctx.moveTo( this.cpLeft[i].x, this.cpLeft[i].y )
			ctx.lineTo( this.cpRight[i].x, this.cpRight[i].y )
			ctx.strokeStyle = hslToFillStyle(135, 100, 25, 0.4)
			ctx.stroke()
			ctx.closePath()

			ctx.lineWidth = 50
			
			
			ctx.beginPath()
			ctx.arc( this.cpLeft[i].x, this.cpLeft[i].y, 5, 0, 2 * Math.PI )
			ctx.fillStyle = hslToFillStyle(90, 50, 50, 0.3)
			ctx.fill()
			ctx.closePath()
			
			ctx.beginPath()
			ctx.arc( this.cpRight[i].x, this.cpRight[i].y, 5, 0, 2 * Math.PI )
			ctx.fillStyle = hslToFillStyle(180, 50, 50, 0.3)
			ctx.fill()
			ctx.closePath()
			
			
		}
	},
	
	drawLineSegments : function( ctx ) {
		var line = this.line
		
		ctx.lineWidth = 1
		ctx.beginPath()
		ctx.strokeStyle = hslToFillStyle(0, 0, 0, 0.3)
		for(i=1; i < line.length; i++) {
			prev = line[i-1]
			curr = line[i]
			
			ctx.moveTo(prev.x,prev.y)
			ctx.lineTo(curr.x,curr.y)
		}
		ctx.stroke()
		ctx.closePath()
	}
}

module.exports = BezierCurveFromLine

},{"../dependancies/Vector2":1,"./utils/hsl-to-fillstyle":7}],3:[function(require,module,exports){
var Vector2 = require('../dependancies/Vector2')
  , BezierCurveFromLine = require('./bezier-curve')
  , hslToFillStyle = require('./utils/hsl-to-fillstyle')

var DrawCurve = function( smoothness, canvas, context, callback ) {
	
	this.smoothness = smoothness
	this.canvas = canvas
	this.context = context
	this.callback = callback
	this.$canvas = $(canvas)
	// this.$message = $('.message')
	this.$drawingTarget = $(canvas)
	this.points = undefined
	this.pointsDistance = undefined
	this.drawingCurve = false
	this.distance = 0
	this.targetPointDistance = 50
	
	this.doDrawCurve = false
	this.doDrawTrail = true
	this.ratio = window.devicePixelRatio >= 1 ? window.devicePixelRatio : 1
	
	this.$drawingTarget.on('mousedown', this.onMouseDown.bind(this) )
	this.$drawingTarget.on('touchmove', this.onTouchMove.bind(this) )
	this.$drawingTarget.on('touchstart', this.onTouchStart.bind(this) )
	
}

DrawCurve.prototype = {
	
	onTouchStart : function(e) {
		e.preventDefault()
		
		if( this.drawingCurve === false ) {

			this.$drawingTarget.on('touchmove', this.onTouchMove.bind(this) )
			this.$drawingTarget.on('touchend', this.onTouchEnd.bind(this) )
			
			// this.$message.hide()
			
			this.drawingCurve = true
			this.points = []
			this.pointsDistance = []
			this.distance = 0
			
			var offset = this.$canvas.offset()
			
			this.addPoint(
				e.originalEvent.touches[0].pageX - offset.left,
				e.originalEvent.touches[0].pageY - offset.top
			)
			
		}
	},
	
	onMouseDown : function(e) {
		
		if( this.drawingCurve === false ) {

			this.$drawingTarget.on('mousemove', this.onMouseMove.bind(this) )
			this.$drawingTarget.on('mouseout', this.onMouseMoveDone.bind(this) )
			this.$drawingTarget.on('mouseup', this.onMouseMoveDone.bind(this) )
			
			// this.$message.hide()
			
			this.drawingCurve = true
			this.points = []
			this.pointsDistance = []
			this.distance = 0
		
			var offset = this.$canvas.offset()
		
			this.addPoint(
				e.pageX - offset.left,
				e.pageY - offset.top
			)
			
		}
	},
	
	onMouseMove : function(e) {
		e.preventDefault()
		
		var offset = this.$canvas.offset()
		
		this.addPoint(
			e.pageX - offset.left,
			e.pageY - offset.top
		)
	},
	
	onTouchMove : function(e) {
		e.preventDefault()
		
		var offset = this.$canvas.offset()
		var touch = e.originalEvent.touches[0]
		
		this.addPoint(
			touch.pageX - offset.left,
			touch.pageY - offset.top
		)
	},
	
	onTouchEnd : function() {
		
		this.$drawingTarget.off('touchmove', this.onTouchMove.bind(this) )
		this.$drawingTarget.off('touchend', this.onTouchEnd.bind(this) )
		
		this.endInteractionAndDrawTree()
	},
	
	onMouseMoveDone : function(e) {
		var points, i, prev, curr, curve,
			ctx = this.context

		this.$drawingTarget.off('mousemove')
		this.$drawingTarget.off('mouseout')
		this.$drawingTarget.off('mouseup')
		
		
		var offset = this.$canvas.offset()
		
		this.addPoint(
			e.pageX - offset.left,
			e.pageY - offset.top
		)
		
		this.endInteractionAndDrawTree()
	},
	
	endInteractionAndDrawTree : function() {
		
		var canvas = this.canvas
		
		this.drawingCurve = false
		
		line = this.smoothLine()
		
		_.each(line, function toUnitVector( vec2 ) {
			vec2.x /= canvas.width
			vec2.y /= canvas.height
		})
		
		curve = new BezierCurveFromLine( line, 0.3 )
		
		if( this.doDrawCurve ) {
			this.drawCurve( curve )
		}
		
		
		if(typeof this.callback === 'function') {
			this.callback( curve )
		}
		
	},
	
	smoothLine : function() {
		
		var divisions, targetDistance, i, distanceAtSegment,
			smoothPoints = [],
			theta,
			newPoint,
			positionOnLinePiece = 0,
			positionPrev = 0,
			positionOnLine = 0
		
		if(this.points.length <= 2) {
			return this.points
		}
		
		divisions = Math.ceil( this.distance / this.targetPointDistance )
		divisions = Math.max(2, divisions)
		targetDistance = this.distance / divisions
		
		i = 0
		j = 0
		
		smoothPoints.push(this.points[0]) //Add the first point
		
		for(j=1; j < divisions; j++) {
			
			distanceAtSegment = j * targetDistance
			
			while(positionOnLine < distanceAtSegment) {
				i++
				positionPrev = positionOnLine
				positionOnLine += this.pointsDistance[i]
			}
			
			positionOnLinePiece = positionOnLine - positionPrev
			
			theta = Math.atan2(
				this.points[i].y - this.points[i-1].y,
				this.points[i].x - this.points[i-1].x
			)
			
			smoothPoints.push( new Vector2(
				this.points[i-1].x + ( positionOnLinePiece ) * Math.cos( theta ),
				this.points[i-1].y + ( positionOnLinePiece ) * Math.sin( theta )				
			))
		}
		
		smoothPoints.push( this.points[this.points.length-1] ) //Add the last point
		
		return smoothPoints
		
	},
	
	addPoint : function(x, y) {
		
		var prev, curr, distance
		
		x *= this.ratio
		y *= this.ratio
		
		curr = new Vector2( x, y )
		
		if(this.points.length > 0) {
			prev = this.points[ this.points.length - 1 ]
		} else {
			prev = curr
		}
		
		distance = Math.sqrt(
			Math.pow( prev.x - curr.x, 2) +
			Math.pow( prev.y - curr.y, 2)
		)
		this.distance += distance
		
		this.points.push( curr )
		this.pointsDistance.push( distance )
		
		if(this.doDrawTrail) {
			this.drawMouseMove( prev, curr )
		}
		
	},
	
	drawCurve : function( curve ) {
		var ctx = this.context
		
		curve.drawLineSegments( ctx )
		curve.drawCurve( ctx )
		curve.drawControlPoints( ctx )
	},
	
	drawMouseMove : function( prev, curr ) {
		
		var ctx = this.context
		
		ctx.lineWidth = 15 * this.ratio
		ctx.strokeStyle = hslToFillStyle(180, 50, 80, 1)
		ctx.beginPath()
		ctx.lineCap = "round"
		ctx.moveTo(prev.x,prev.y)
		ctx.lineTo(curr.x,curr.y)
		ctx.stroke()
		ctx.closePath()	
	}
}

module.exports = DrawCurve
},{"../dependancies/Vector2":1,"./bezier-curve":2,"./utils/hsl-to-fillstyle":7}],4:[function(require,module,exports){
var Scene = require('./scene')

window.Generator = (function() {

    var canvas = document.createElement( 'canvas' )
    var context = canvas.getContext( '2d' )
	var scene
	
    var settings = {
        
        background: {
            type: 'color',
            label: 'Background',
            value: '#000000'
        },
		
        hue: {
            type: 'number',
            range: [ 0, 360 ],
            value: 180,
            step: 1
        },
        
		colorfulness: {
            type: 'number',
            range: [ 0, 20 ],
            value: 10,
            step: 1
        },
		
        variation: {
            type: 'number',
            range: [ 0, 1000 ],
            value: 707,
            step: 1
        }
    }

    return {

        context: context,

        settings: settings,

        initialize: function( done ) {
			
			scene = new Scene( canvas, context, settings )
            done()
        },

        generate: function( done ) {
						
			scene.draw()

            done()
        },

        destroy: function( done ) {

            done()
        }
    }

})();
},{"./scene":6}],5:[function(require,module,exports){
var Vector2 = require('../dependancies/Vector2')

var LineNode = function() {
	this.beg = new Vector2()
	this.end = new Vector2()
	this.segment = new Vector2
	this.distance = undefined
	
	this.children = []
}

LineNode.prototype = {
	update : function() {

		this.segment.x = this.end.x - this.beg.x
		this.segment.y = this.end.y - this.beg.y
		
		this.distance = Math.sqrt( this.segment.x * this.segment.x + this.segment.y * this.segment.y )
		this.theta = Math.atan2( this.segment.y, this.segment.x )
	}
}

module.exports = LineNode
},{"../dependancies/Vector2":1}],6:[function(require,module,exports){
var DrawCurve = require('./draw-curve')
  , LineNode = require('./line-node')
  , hslToFillStyle = require('./utils/hsl-to-fillstyle')
  , rgbToFillStyle = require('./utils/rgb-to-fillstyle')
  , Vector2 = require('../dependancies/Vector2')
  

var Scene = function( canvas, context, settings ) {
	
	this.$canvas = $(canvas)
	this.canvas = canvas
	this.ratio = window.devicePixelRatio >= 1 ? window.devicePixelRatio : 1
	this.context = context
	this.settings = settings
	
	this.maxChildNodes = 3
	this.childLength = 0.9
	this.baseTheta = Math.PI * (80 / 180)
	this.nodeLevels = 7
	this.lineWidth = 8 * this.ratio
	this.curve = null
	this.hue = null
		
	//Disable scroll on old iOS devices
	$(canvas).on('touchmove', false)
	
	_.bindAll( this, 'onNewCurve' )
	
	this.drawCurve = new DrawCurve( 50, this.canvas, this.context, this.onNewCurve )
	
	this.reset()
}
		
Scene.prototype = {
	
	
	reset : function() {
		
		stuvio.random.seed = this.settings.variation.value
		
		this.context.fillStyle = this.settings.background.value
		this.context.fillRect(0,0,this.canvas.width, this.canvas.height)
		
		this.maxChildNodes = stuvio.random.int(2, 5)
		this.childLength = stuvio.random.float(0.9, 0.99)
		this.baseTheta = Math.PI * (90 / 180) * stuvio.random.float(0.5, 1)
		this.nodeLevels = stuvio.random.int(6, 20)
		this.lineWidth = 20 * stuvio.random.float(0.3, 1) * this.ratio
		// this.hue = stuvio.random.float(0, 360)
		this.hue = this.settings.hue.value
		
	},
	
	generateLine : function( prevLineNode, prevLevel, totalLevels ) {
		
		var i
		var lineNode = new LineNode()
		var currentLevel = prevLevel - 1
		var ratioTop = (totalLevels - currentLevel) / totalLevels
		var ratioBottom = currentLevel / totalLevels
		var randomness = stuvio.random.float(-1, 1)
		var thetaChange = this.baseTheta * randomness
		var theta = prevLineNode.theta - thetaChange //Theta is the previous angle, minus base theta
		var hyp = prevLineNode.distance * this.childLength
		var numberOfChildNodes = Math.round(this.maxChildNodes * stuvio.random.float(0.5, 1))
		
		lineNode.beg.copy(prevLineNode.end)
		lineNode.end.x = prevLineNode.end.x + ( hyp ) * Math.cos( theta )
		lineNode.end.y = prevLineNode.end.y + ( hyp ) * Math.sin( theta )
		
		lineNode.update()
		
		prevLineNode.children.push( lineNode )
		
		if(currentLevel > 0) {
			for(i=0; i < numberOfChildNodes; i++) {
				this.generateLine( lineNode, currentLevel, totalLevels )
			}
		}
	},
	
	onNewCurve : function( curve ) {
		var i, lineNode
		
		this.settings.unitCurve = curve
		this.unitCurve = curve
		
		this.draw()
	},
	
	draw : function() {
		
		this.reset()
				
		if( this.unitCurve ) {
			
			var lines = _.map( this.unitCurve.line, function( line ) {
			
				return new Vector2(
					line.x * this.canvas.width,
					line.y * this.canvas.height
				)
			
			}.bind(this))
			
			for(i=1; i < lines.length; i++) {
			
				this.hue += this.settings.colorfulness.value
				this.hue %= 360
				this.lineWidth *= 0.92
			
				lineNode = new LineNode()
		
				lineNode.beg.copy( lines[i-1] )
				lineNode.end.copy( lines[i] )
				//lineNode.end.lerp( lineNode.beg, 0.5 )
			
				lineNode.update()
				this.generateLine( lineNode, this.nodeLevels, this.nodeLevels )
		
				this.context.strokeStyle = hslToFillStyle(180, 50, 50)
				this.context.lineCap = "round"
				this.drawTree( lineNode, this.nodeLevels, this.nodeLevels )
			}
		}
		
	},
	
	drawTree : function( lineNode, prevLevel, totalLevels ) {
		
		var ratio = prevLevel / totalLevels
		var ratio2 = ( (ratio * ratio) + ratio ) / 2		
		
		this.context.lineWidth = ratio2 * this.lineWidth
		
		this.context.beginPath()
		this.context.moveTo( lineNode.beg.x, lineNode.beg.y )
		this.context.lineTo( lineNode.end.x, lineNode.end.y )
		this.context.strokeStyle = hslToFillStyle(
			this.hue - 90 * ratio,
			30 * (ratio2) + 20 + 10,
			(30 * (ratio) + 30) * stuvio.random.float(0.8, 1),
			0.9
		)
		this.context.stroke()
		this.context.closePath()
		
	   	for(var i=0; i < lineNode.children.length; i++) {
	   		this.drawTree( lineNode.children[i], prevLevel - 1, totalLevels )
	   	}
	}
	
}

module.exports = Scene
},{"../dependancies/Vector2":1,"./draw-curve":3,"./line-node":5,"./utils/hsl-to-fillstyle":7,"./utils/rgb-to-fillstyle":8}],7:[function(require,module,exports){
var hslToFillStyle = function(h, s, l, a) {
	if(a === undefined) {
		return ["hsl(",h,",",s,"%,",l,"%)"].join('')
	} else {
		return ["hsla(",h,",",s,"%,",l,"%,",a,")"].join('')
	}
}

module.exports = hslToFillStyle
},{}],8:[function(require,module,exports){
var rgbToFillStyle = function(r, g, b, a) {
	if(a === undefined) {
		return ["rgb(",r,",",g,",",b,")"].join('')
	} else {
		return ["rgba(",r,",",g,",",b,",",a,")"].join('')
	}
}

module.exports = rgbToFillStyle
},{}]},{},[4]);
