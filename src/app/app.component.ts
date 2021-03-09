import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{

  private camera: THREE.PerspectiveCamera;
  private house: THREE.Object3D;
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLDivElement;
  private mouse: THREE.Vector2;
  private intersects: THREE.Intersection[];
  private light: THREE.PointLight;

  @ViewChild('scene')
  el: ElementRef;

  // raycaster: THREE.Raycaster;

  ngAfterViewInit(): void {
    this.container = this.el.nativeElement;
    this.mouse = new THREE.Vector2(1, 1);
    this.intersects = [];
    
    this.scene = new THREE.Scene();

    const fov = 35;

    const aspectRatio = this.container.clientWidth / this.container.clientHeight;

    const near = 0.1;
    const far = 50;

    this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
    this.camera.position.set(-5,1,20);
    
    this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // var controls = new OrbitControls( this.camera, this.renderer.domElement );
    // this.raycaster = new THREE.Raycaster();
      
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambient);

    // this.light = new THREE.DirectionalLight(0xff3355,0.8);
    // this.light.scale.set(0.5,0.5,0.5)
    // this.light.position.set(50,50,50);
    // this.scene.add(this.light);

    this.light = new THREE.PointLight( 0xff0000, 1, 100 );
    this.light.position.set( 50, 50, 50 );
    this.scene.add( this.light );

    // const light2 = new THREE.DirectionalLight(0x33aa55,2);
    // light2.position.set(-10,-10,10);
    // this.scene.add(light2);

    let loader = new GLTFLoader()
    loader.load('../assets/models/scene.gltf', (gltf) => {
        this.scene.add(gltf.scene);
        this.house = gltf.scene.children[0];
        // this.house.scale.set(2,2,2);
        // this.renderer.render(this.scene, this.camera);
        this.animate();
    })
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.house.rotation.z += 0.005;
    this.renderer.render(this.scene, this.camera);
    // this.raycaster.setFromCamera(this.mouse, this.camera);
    // this.intersects = this.raycaster.intersectObject(this.house,true);
    // if (this.intersects.length !== 0) {
    //   this.light.position.set(this.mouse.x, this.mouse.y,10);
    // } else {
    //   this.light.position.set(50,50,50);
    // }
  }

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(event) {
    this.mouse.x = ( event.clientX / this.container.clientWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / this.container.clientHeight ) * 2 + 1;
  }

  @HostListener('window:resize')
  resize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}
