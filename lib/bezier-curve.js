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
