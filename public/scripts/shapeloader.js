"use strict";
$( () => {

    function countShpElements ( path ) {
        shapefile.openShp( path, null )
            .then( source => console.log( path + ' => ' + source._source._array.length ) )
            .catch( error => console.error( error ) )
        ;
    }

    countShpElements( '/shp/c1.shp' );
    countShpElements( '/shp/c5.shp' );
    countShpElements( '/shp/l1.shp' );
    countShpElements( '/shp/l5.shp' );
    countShpElements( '/shp/m1.shp' );
    countShpElements( '/shp/m5.shp' );
    countShpElements( '/shp/h1.shp' );
    countShpElements( '/shp/h5.shp' );
} );