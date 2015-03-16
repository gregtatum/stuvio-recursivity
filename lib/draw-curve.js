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