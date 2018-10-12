var express = require( 'express' );
var router = express.Router();

/* GET home page. */
router.get( '/', ( req, res, next ) => {
    res.render( 'index', { title: 'Express' } );
} );
router.get( '/conv', ( req, res, next ) => {
    res.render( 'converter' );
} );

module.exports = router;
