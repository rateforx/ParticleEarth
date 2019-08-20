"use strict";
/// Three base objects
let canvas;
let scene; // three scene
// let world; // cannon world
let renderer;
let camera; // perspective camera
let controls; // orbit controls
let axesHelper;

/// 3D objects
let geometry;
let tg;
let pointsMaterial;
let shaderMaterial;
let globe;

/// Constants
const DEBUG = false; // show helpers
const CONTROLS = true; // enable orbit controls

$( () => {

    function initThree () {
        scene = new THREE.Scene();
        // scene.background = new THREE.Color( 'red' );
        renderer = new THREE.WebGLRenderer( {
            antialias: true,
        } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.sortObjects = false;

        canvas = renderer.domElement;
        $( '#viewport' ).append( renderer.domElement );

        camera = new THREE.PerspectiveCamera(
            35, // fov
            window.innerWidth / window.innerHeight, // ratio
            .1, // near
            0 // far - infinite
        );
        camera.position.set( -32000, 1500, -16000 );
        camera.lookAt( scene.position );

        if ( DEBUG ) {
            axesHelper = new THREE.AxesHelper( 20 );
            scene.add( axesHelper );
        }
        if ( CONTROLS ) {
            controls = new THREE.OrbitControls( camera, renderer.domElement );
            controls.autoRotate = true;
            controls.autoRotateSpeed = -1; // default: 2 => 30s rotation
            controls.enableDamping = true;
            controls.dampingFactor = .5;
            controls.enableKeys = false;
            controls.enablePan = false;
            controls.rotateSpeed = .25;
        }

        geometry = new THREE.BufferGeometry;
        // const BUFFER_SIZE_ARTIFICIAL = 5000;
        // const BUFFER_SIZE_CRUDE = 162248;
        // const BUFFER_SIZE_LOW = 1246688;
        // const BUFFER_SIZE_MEDIUM = 7407848;
        // const BUFFER_SIZE_HIGH = 34681232;
        // geometry = new THREE.BufferGeometry();
        // geometry.addAttribute( 'position', new THREE.BufferAttribute(
        //     new Float32Array( BUFFER_SIZE_CRUDE * 3 ), 3
        // ) );
        // geometry.attributes.position.dynamic = true;
        // geometry.addAttribute( 'color', new THREE.BufferAttribute(
        //     new Float32Array( BUFFER_SIZE_CRUDE * 3 ), 3
        // ) );
        // geometry.attributes.color.dynamic = true;
        // geometry.setDrawRange( 0, 0 );

        // tg = new THREE.BufferGeometry();
        // tg.addAttribute( 'position', new THREE.BufferAttribute(
        //     new Float32Array( 12 * 3 ), 3
        // ) );

        pointsMaterial = new THREE.PointsMaterial( {
            vertexColors: THREE.VertexColors,
            size: 25,
        } );
        // material.onBeforeCompile = shader => console.log( shader );

        globe = new THREE.Points( geometry, pointsMaterial );
        globe.quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), Math.PI );
        globe.scale.setScalar( 10000 );
        scene.add( globe );

        let vertices;
        // let vertexShader;
        // let fragmentShader;

        $.when(
            $.ajax( '/pics/earth-half.json', {
                success: data => vertices = data,
            } ),
            // $.ajax( '/shaders/shiveringPoints.glsl', {
            //     success: data => vertexShader = data,
            // } ),
            // $.ajax( '/shaders/fragment.glsl', {
            //     success: data => fragmentShader = data,
            // } ),
        ).then( () => {
            // pointsMaterial = new THREE.PointsMaterial( {
            //     vertexColors: THREE.VertexColors,
            //     size: 25,
            // } );
            // pointsMaterial.onBeforeCompile = shader => {
            //     shader.vertexShader = vertexShader;
            //     shader.fragmentShader = fragmentShader;
                // shader.vertexShader.replace( '#include <begin_vertex>', [
                //
                // ]);
            // });
            // globe.material = pointsMaterial;

            /*shaderMaterial = new THREE.ShaderMaterial( {
                uniforms: {
                    uResolution: { value: new THREE.Vector2( canvas.width, canvas.height ) },
                    uScale: { value: 10 },
                    uTime: { value: Date.now() },
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                vertexColors: THREE.VertexColors,
                wireframe: true,
                // size: 10,
            } );
            // globe.material = material;
            */

            globe.geometry = new THREE.Geometry();

            let positions = [];
            let colors = [];
            let color = new THREE.Color;
            for ( let i = 0; i < vertices.length; i++ ) {
                let point = equirectangularToSpherical( vertices[ i ].x, vertices[ i ].y );
                globe.geometry.vertices.push( new THREE.Vector3( point.x, point.y, point.z ) );
                // positions.push( point.x, point.y, point.z );
                color.setHSL( Math.random() * 360, 1, .65 );
                // colors.push( color.r, color.g, color.b );
                globe.geometry.vertices.colors.push( color );
            }
            globe.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
            globe.geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
            globe.geometry.rotateX( Math.PI / 2 );
            globe.geometry.center();
            // globe.onBeforeRender = updateUniforms;
        } );


        // loadVertices( '/shp/c1.shp', globe.geometry );
        // loadVertices( '/shp/c5.shp', globe.geometry );
    }

    /**
     * @param path {String}
     * @param geometry {THREE.BufferGeometry}
     */
    function loadVertices ( path, geometry ) {
        shapefile.openShp( path, null ) // load file or open stream
            .then( source => {

                let index = 0;

                return source.read().then( function next ( result ) {
                    if ( result.done ) { // exit on end of stream

                        return;
                    }

                    // todo loop thru coord array and add them as vertices
                    // access arr like: result.value.coordinates[0] => array of [ x, y ]
                    for ( let coord of result.value.coordinates[ 0 ] ) {
                        let xyz = equirectangularToSpherical( coord[ 0 ], coord[ 1 ] );
                        let color = new THREE.Color().setHSL( Math.random() * 360, 1, .6 );
                        // geometry.attributes.position.array[ index++ ] = xyz.x;
                        // geometry.attributes.position.array[ index++ ] = xyz.y;
                        // geometry.attributes.position.array[ index++ ] = xyz.z;

                        geometry.attributes.color.array[ index ] = color.r;
                        geometry.attributes.position.array[ index++ ] = coord[ 0 ];
                        geometry.attributes.color.array[ index ] = color.g;
                        geometry.attributes.position.array[ index++ ] = coord[ 1 ];
                        geometry.attributes.color.array[ index ] = color.b;
                        geometry.attributes.position.array[ index++ ] = 0;

                        geometry.setDrawRange( 0, index / 3 ); // increase draw range

                        geometry.attributes.position.needsUpdate = true;
                        // geometry.computeBoundingSphere();
                    }

                    return source.read().then( next ); // go to next element in stream
                } );
            } )
            .catch( error => console.error( error ) );
    }

    function draw () {
        window.requestAnimationFrame( draw );
        renderer.render( scene, camera );
        // updateUniforms();
        controls.update();
    }

    /**
     * Translates equirectangular coordinates to polar coordinates and then to local 3-dimentional positions.
     * @param x {number}
     * @param y {number}
     * @return {{x: number, y: number, z: number}}
     */
    function equirectangularToSpherical ( x, y ) {
        let meridian0 = 0;
        let scale = 1; // coords scale
        let ratio = 1;
        let longitude = meridian0 + x / scale * ratio;
        let latitude = y / scale;
        let radius = 1;
        let dither = 0;
        // return {
        //     x: (radius - Math.random() * dither - dither) * Math.sin( latitude ) * Math.cos( longitude ), // x
        //     y: (radius - Math.random() * dither - dither) * Math.sin( latitude ) * Math.sin( longitude ), // y
        //     z: (radius - Math.random() * dither - dither) * Math.cos( latitude ), // z
        // };
        return new THREE.Vector3(
            (radius - Math.random() * dither - dither) * Math.sin( latitude ) * Math.cos( longitude ), // x
            (radius - Math.random() * dither - dither) * Math.sin( latitude ) * Math.sin( longitude ), // y
            (radius - Math.random() * dither - dither) * Math.cos( latitude ), // z
        )
    }

    function updateUniforms () {
        globe.material.uniforms = {
            uResolution: { value: new THREE.Vector2( canvas.width, canvas.height ) },
            uScale: { value: 100 },
            uTime: { value: Date.now() * .0001 },
        };
    }

    function reset () {
        //
    }

    function onResize () {
        let width = window.innerWidth;
        let height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );
    }

    $( window ).resize( onResize );

    // run
    initThree();
    window.requestAnimationFrame( draw );
} );