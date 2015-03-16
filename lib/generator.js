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