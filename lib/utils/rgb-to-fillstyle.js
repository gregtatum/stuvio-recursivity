var rgbToFillStyle = function(r, g, b, a) {
	if(a === undefined) {
		return ["rgb(",r,",",g,",",b,")"].join('')
	} else {
		return ["rgba(",r,",",g,",",b,",",a,")"].join('')
	}
}

module.exports = rgbToFillStyle