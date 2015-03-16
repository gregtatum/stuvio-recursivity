var hslToFillStyle = function(h, s, l, a) {
	if(a === undefined) {
		return ["hsl(",h,",",s,"%,",l,"%)"].join('')
	} else {
		return ["hsla(",h,",",s,"%,",l,"%,",a,")"].join('')
	}
}

module.exports = hslToFillStyle