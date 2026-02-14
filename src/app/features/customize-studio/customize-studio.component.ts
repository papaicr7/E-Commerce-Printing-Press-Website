import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  signal,
  NgZone,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import * as THREE from 'three';

@Component({
  selector: 'app-customize-studio',
  standalone: true,
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './customize-studio.component.html',
  styleUrl: './customize-studio.component.scss',
})
export class CustomizeStudioComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: false }) canvasRef!: ElementRef<HTMLDivElement>;

  readonly activeColor = signal('#7A3B7A');
  readonly customText = signal('Your Design');
  readonly fontSize = signal(28);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private mugGroup!: THREE.Group;
  private textTexture!: THREE.CanvasTexture;
  private animationId = 0;

  readonly colorPresets = [
    { hex: '#7A3B7A', label: 'Royal Purple' },
    { hex: '#F5B82E', label: 'Gold' },
    { hex: '#2D2D2D', label: 'Charcoal' },
    { hex: '#E8E0D0', label: 'Cream' },
    { hex: '#1B3A5C', label: 'Navy' },
    { hex: '#8B4513', label: 'Saddle' },
  ];

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.initScene());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
  }

  private initScene(): void {
    const container = this.canvasRef.nativeElement;
    const w = container.clientWidth;
    const h = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f0ea);

    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.set(0, 1.5, 5);
    this.camera.lookAt(0, 0.5, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);
    const dirL = new THREE.DirectionalLight(0xffffff, 1.2);
    dirL.position.set(4, 6, 4);
    this.scene.add(dirL);
    const rimL = new THREE.PointLight(0xf5b82e, 0.5, 12);
    rimL.position.set(-3, 2, -2);
    this.scene.add(rimL);

    // Table / ground plane
    const plateGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.08, 64);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xd4c5a9, metalness: 0, roughness: 0.6 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.04;
    this.scene.add(plate);

    // Mug
    this.mugGroup = new THREE.Group();
    this.createMug();
    this.scene.add(this.mugGroup);

    // Start animation loop
    this.animate();

    // Resize handling
    const resizeObserver = new ResizeObserver(() => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      this.camera.aspect = nw / nh;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(nw, nh);
    });
    resizeObserver.observe(container);
  }

  private createMug(): void {
    // Clear previous mesh
    while (this.mugGroup.children.length > 0) {
      this.mugGroup.remove(this.mugGroup.children[0]);
    }

    const color = new THREE.Color(this.activeColor());

    // Body – a cylinder (outer shell)
    const bodyGeo = new THREE.CylinderGeometry(0.7, 0.65, 1.6, 64, 1, true);
    this.textTexture = this.makeTextTexture();
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      map: this.textTexture,
      roughness: 0.25,
      metalness: 0.05,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8;
    this.mugGroup.add(body);

    // Inner
    const innerGeo = new THREE.CylinderGeometry(0.64, 0.59, 1.55, 64, 1, true);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xfaf7f0, roughness: 0.5, side: THREE.BackSide });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.y = 0.82;
    this.mugGroup.add(inner);

    // Bottom disc
    const bottomGeo = new THREE.CircleGeometry(0.65, 64);
    const bottomMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = 0.01;
    this.mugGroup.add(bottom);

    // Top rim
    const rimGeo = new THREE.TorusGeometry(0.7, 0.03, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xfaf7f0, roughness: 0.3 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = 1.59;
    rim.rotation.x = Math.PI / 2;
    this.mugGroup.add(rim);

    // Handle – torus segment
    const handleGeo = new THREE.TorusGeometry(0.42, 0.08, 16, 32, Math.PI);
    const handleMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(-0.92, 0.85, 0);
    handle.rotation.z = Math.PI / 2;
    this.mugGroup.add(handle);
  }

  private makeTextTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = this.activeColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${this.fontSize()}px Playfair Display, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.customText(), canvas.width / 2, canvas.height / 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.mugGroup) {
      this.mugGroup.rotation.y += 0.005;
    }
    this.renderer.render(this.scene, this.camera);
  }

  setColor(hex: string): void {
    this.activeColor.set(hex);
    this.rebuildMug();
  }

  updateText(event: Event): void {
    this.customText.set((event.target as HTMLInputElement).value);
    this.rebuildMug();
  }

  private rebuildMug(): void {
    this.createMug();
  }
}
