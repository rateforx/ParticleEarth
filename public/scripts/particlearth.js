"use strict";
$( function () {

    /// Three base objects
    let scene; // three scene
    let world; // cannon world
    let renderer;
    let camera; // perspective camera
    let controls; // orbit controls
    let axesHelper;

    /// 3D objects
    let geometry;
    let material;
    let points;

    /// Constants
    const DEBUG = false; // show helpers
    const CONTROLS = true; // enable orbit controls
    const DATA = []; // initial coords, shouldn't be changed

    function initThree() {
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer( {
            antialias: true,
        } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.sortObjects = false;

        $( '#viewport' ).append( renderer.domElement );

        camera = new THREE.PerspectiveCamera(
            35, // fov
            window.innerWidth / window.innerHeight, // ratio
            .1, // near
            20000 // far
        );
        camera.position.set( 0, 0, -7000 );
        camera.lookAt( scene.position );

        if ( DEBUG ) {
            axesHelper = new THREE.AxesHelper( 20 );
            scene.add( axesHelper );
        }
        if ( CONTROLS ) {
            controls = new THREE.OrbitControls( camera, renderer.domElement );
        }

        geometry = new THREE.BufferGeometry;
        let pointsSize = 20;
        material = new THREE.PointsMaterial( {
            vertexColors: THREE.VertexColors,
            size: pointsSize,
        } );
        points = new THREE.Points( geometry, material );
        points.quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), Math.PI );
        scene.add( points );

        $.ajax(
            '/points/earth.json',
            {
                complete: xhr => {
                    if ( xhr.status === 200 ) {
                        let data = JSON.parse( xhr.responseText );

                        let spread = 200;
                        let diffusion = 10;
                        let diffusionScale = new THREE.Vector3( 1, 1, 0 );
                        let positions = [];
                        let colors = [];
                        let color = new THREE.Color;
                        for ( let i = 0; i < data.length; i++ ) {
                            positions.push(
                                data[i].x + diffusionScale.x * ( Math.random() * diffusion - diffusion ), // x axis
                                data[i].y + diffusionScale.y * ( Math.random() * diffusion - diffusion ), // y axis
                                Math.random() * spread - spread / 2 + diffusionScale.z * ( Math.random() * diffusion - diffusion ), // z axis
                            );
                            color.setHSL( Math.random() * 360, 1, .65 );
                            colors.push( color.r, color.g, color.b );
                        }

                        points.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
                        points.geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
                        points.geometry.center();

                        draw();
                    }
                }
            }
        );
    }

    function draw() {
        window.requestAnimationFrame( draw );
        renderer.render( scene, camera );

        let amount = 500;
        let pos = points.geometry.attributes.position;
        for ( let i = 0; i < pos.count / 2; i++ ) {
            pos[ Math.random() * pos.count - 1 ] += Math.random() * amount - amount;
        }
    }

    /**
     *
     * @param geometry {THREE.Geometry}
     * @param amount {Number}
     * @param scale {THREE.Vector3}
     */
    function diffuseVertices ( geometry, amount, scale ) {
        // todo
    }

    function reset() {
        //
    }

    // run
    initThree();
    // window.requestAnimationFrame( draw );

    window.scene = scene;
    window.points = points;
    window.camera = camera;
    window.r = renderer;
} );