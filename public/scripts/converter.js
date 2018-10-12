$( () => {
    function init () {
        let canvas = document.getElementById( "canvas" );
        let ctx = canvas.getContext( "2d" );
        let img = document.getElementById( "pic" );

        let w = canvas.width = img.width;
        let h = canvas.height = img.height;

        ctx.drawImage( img, 0, 0 );

        render();

        let data = ctx.getImageData( 0, 0, w, h ).data;
        console.log( data );

        // data = Array.from( data.data );
        // for ( let i = 0; i < w * h; i++ ) {
        //     data.splice( i + 1, 3 ); // remove green, blue and alpha channels info
        // }
        // for ( let row = 0; row < h; row++ ) {
        //     matrix.push( data.splice( 0, w ) );// cut the top row and append it to the pixel matrix
        // }
        console.log( w );

        let coords = [];
        // iterate thru every pixel (red channel)
        for ( let i = 0; i < data.length; i += 4 ) {
            //if pixel is black
            if ( data[ i ] === 0 ) {
                // calculate its x and y coords
                let y = Math.floor( i / 4 / w );
                let x = i / 4 - y * w;
                // and add it to array
                coords.push( {
                    x: x,
                    y: y
                } );
            }
        }
        console.log( coords );

        let blob = new Blob(
            [ JSON.stringify( coords ) ],
            {
                type: 'json',
            },
        );
        saveAs( blob, 'coords.json' );
    }

    function render () {
        window.requestAnimationFrame( render );
    }

    $( '#pic' )[ 0 ].onload = init;
} );