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