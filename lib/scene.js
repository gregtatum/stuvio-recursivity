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
		} else {
			
			this.context.font = Math.round( this.canvas.width / 10 ) + "px Montserrat, sans-serif"
			this.context.textAlign = "center"
			this.context.fillStyle = "#ffffff"
			this.context.fillText("Draw Here", this.canvas.width / 2, this.canvas.height / 2);
			this.context.fillText("Draw Here", this.canvas.width / 2, this.canvas.height / 2);
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