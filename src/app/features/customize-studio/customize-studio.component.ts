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

export type ProductType = 'mug' | 'tshirt' | 'frame' | 'bottle';

export interface ProductOption {
  type: ProductType;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-customize-studio',
  standalone: true,
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './customize-studio.component.html',
  styleUrl: './customize-studio.component.scss',
})
export class CustomizeStudioComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: false }) canvasRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef<HTMLInputElement>;

  readonly activeProduct = signal<ProductType>('mug');
  readonly activeColor = signal('#7A3B7A');
  readonly activeTextColor = signal('#FFFFFF');
  readonly customText = signal('Your Design');
  readonly fontSize = signal(28);
  readonly uploadedImage = signal<string | null>(null);
  readonly isDragOver = signal(false);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private productGroup!: THREE.Group;
  private textTexture!: THREE.CanvasTexture;
  private animationId = 0;
  private uploadedImg: HTMLImageElement | null = null;

  readonly productOptions: ProductOption[] = [
    { type: 'mug', label: 'Mug', icon: 'coffee' },
    { type: 'tshirt', label: 'Apparel', icon: 'checkroom' },
    { type: 'frame', label: 'Frame', icon: 'photo_frame' },
    { type: 'bottle', label: 'Bottle', icon: 'water_drop' },
  ];

  readonly colorPresets = [
    { hex: '#7A3B7A', label: 'Royal Purple' },
    { hex: '#F5B82E', label: 'Gold' },
    { hex: '#2D2D2D', label: 'Charcoal' },
    { hex: '#E8E0D0', label: 'Cream' },
    { hex: '#1B3A5C', label: 'Navy' },
    { hex: '#8B4513', label: 'Saddle' },
    { hex: '#C72C41', label: 'Crimson' },
    { hex: '#2E8B57', label: 'Sea Green' },
  ];

  readonly textColorPresets = [
    { hex: '#FFFFFF', label: 'White' },
    { hex: '#000000', label: 'Black' },
    { hex: '#F5B82E', label: 'Gold' },
    { hex: '#E53935', label: 'Red' },
    { hex: '#1B3A5C', label: 'Navy' },
    { hex: '#2E8B57', label: 'Emerald' },
    { hex: '#FF6F00', label: 'Amber' },
    { hex: '#AB47BC', label: 'Violet' },
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

  // ── Scene Setup ──────────────────────────────────────────

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

    // Product group
    this.productGroup = new THREE.Group();
    this.buildProduct();
    this.scene.add(this.productGroup);

    // Animation
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

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    if (this.productGroup) {
      this.productGroup.rotation.y += 0.005;
    }
    this.renderer.render(this.scene, this.camera);
  }

  // ── Product Builders ─────────────────────────────────────

  private clearGroup(): void {
    while (this.productGroup.children.length > 0) {
      const child = this.productGroup.children[0];
      this.productGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  }

  private buildProduct(): void {
    this.clearGroup();
    this.textTexture = this.makeTextTexture();

    switch (this.activeProduct()) {
      case 'mug':
        this.createMug();
        break;
      case 'tshirt':
        this.createTshirt();
        break;
      case 'frame':
        this.createFrame();
        break;
      case 'bottle':
        this.createBottle();
        break;
    }
  }

  private createMug(): void {
    const color = new THREE.Color(this.activeColor());

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.7, 0.65, 1.6, 64, 1, true);
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      map: this.textTexture,
      roughness: 0.25,
      metalness: 0.05,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8;
    this.productGroup.add(body);

    // Inner
    const innerGeo = new THREE.CylinderGeometry(0.64, 0.59, 1.55, 64, 1, true);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xfaf7f0, roughness: 0.5, side: THREE.BackSide });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.y = 0.82;
    this.productGroup.add(inner);

    // Bottom disc
    const bottomGeo = new THREE.CircleGeometry(0.65, 64);
    const bottomMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = 0.01;
    this.productGroup.add(bottom);

    // Top rim
    const rimGeo = new THREE.TorusGeometry(0.7, 0.03, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xfaf7f0, roughness: 0.3 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = 1.59;
    rim.rotation.x = Math.PI / 2;
    this.productGroup.add(rim);

    // Handle
    const handleGeo = new THREE.TorusGeometry(0.42, 0.08, 16, 32, Math.PI);
    const handleMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(-0.92, 0.85, 0);
    handle.rotation.z = Math.PI / 2;
    this.productGroup.add(handle);
  }

  private createTshirt(): void {
    const color = new THREE.Color(this.activeColor());

    // T-shirt body — flat box shape
    const bodyGeo = new THREE.BoxGeometry(1.8, 2.0, 0.15, 1, 1, 1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.7,
      metalness: 0.0,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.0;
    this.productGroup.add(body);

    // Front panel with text/image
    const frontGeo = new THREE.PlaneGeometry(1.4, 1.4);
    const frontMat = new THREE.MeshStandardMaterial({
      map: this.textTexture,
      transparent: true,
      roughness: 0.8,
    });
    const front = new THREE.Mesh(frontGeo, frontMat);
    front.position.set(0, 1.05, 0.08);
    this.productGroup.add(front);

    // Left sleeve
    const sleeveGeo = new THREE.BoxGeometry(0.7, 0.6, 0.12);
    const sleeveMat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
    const leftSleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
    leftSleeve.position.set(-1.15, 1.65, 0);
    leftSleeve.rotation.z = Math.PI / 6;
    this.productGroup.add(leftSleeve);

    // Right sleeve
    const rightSleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
    rightSleeve.position.set(1.15, 1.65, 0);
    rightSleeve.rotation.z = -Math.PI / 6;
    this.productGroup.add(rightSleeve);

    // Collar
    const collarGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xfaf7f0, roughness: 0.5 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(0, 2.0, 0);
    collar.rotation.x = Math.PI / 2;
    this.productGroup.add(collar);
  }

  private createFrame(): void {
    const color = new THREE.Color(this.activeColor());

    // Outer frame
    const outerGeo = new THREE.BoxGeometry(2.2, 2.8, 0.15);
    const outerMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.15,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    outer.position.y = 1.4;
    this.productGroup.add(outer);

    // Inner "photo" area with text/image
    const innerGeo = new THREE.PlaneGeometry(1.6, 2.2);
    const innerMat = new THREE.MeshStandardMaterial({
      map: this.textTexture,
      roughness: 0.5,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.set(0, 1.4, 0.08);
    this.productGroup.add(inner);

    // Frame border — top
    const borderH = new THREE.BoxGeometry(2.2, 0.2, 0.2);
    const borderMat = new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.2 });

    const topBorder = new THREE.Mesh(borderH, borderMat);
    topBorder.position.set(0, 2.8, 0);
    this.productGroup.add(topBorder);

    const bottomBorder = new THREE.Mesh(borderH, borderMat);
    bottomBorder.position.set(0, 0.0, 0);
    this.productGroup.add(bottomBorder);

    // Frame border — sides
    const borderV = new THREE.BoxGeometry(0.2, 2.8, 0.2);

    const leftBorder = new THREE.Mesh(borderV, borderMat);
    leftBorder.position.set(-1.1, 1.4, 0);
    this.productGroup.add(leftBorder);

    const rightBorder = new THREE.Mesh(borderV, borderMat);
    rightBorder.position.set(1.1, 1.4, 0);
    this.productGroup.add(rightBorder);

    // Stand
    const standGeo = new THREE.BoxGeometry(0.08, 1.2, 0.08);
    const standMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, 0.6, -0.4);
    stand.rotation.x = 0.15;
    this.productGroup.add(stand);
  }

  private createBottle(): void {
    const color = new THREE.Color(this.activeColor());

    // Bottle profile using LatheGeometry
    const points: THREE.Vector2[] = [];
    // bottom
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.55, 0));
    points.push(new THREE.Vector2(0.6, 0.05));
    // body
    points.push(new THREE.Vector2(0.6, 0.1));
    points.push(new THREE.Vector2(0.62, 0.5));
    points.push(new THREE.Vector2(0.62, 1.5));
    // shoulder
    points.push(new THREE.Vector2(0.55, 1.7));
    points.push(new THREE.Vector2(0.4, 1.9));
    // neck
    points.push(new THREE.Vector2(0.25, 2.0));
    points.push(new THREE.Vector2(0.22, 2.3));
    points.push(new THREE.Vector2(0.22, 2.5));
    // lip
    points.push(new THREE.Vector2(0.26, 2.52));
    points.push(new THREE.Vector2(0.26, 2.58));
    points.push(new THREE.Vector2(0.22, 2.6));

    const bottleGeo = new THREE.LatheGeometry(points, 64);
    const bottleMat = new THREE.MeshStandardMaterial({
      color,
      map: this.textTexture,
      roughness: 0.2,
      metalness: 0.3,
    });
    const bottle = new THREE.Mesh(bottleGeo, bottleMat);
    bottle.position.y = 0.0;
    this.productGroup.add(bottle);

    // Cap
    const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.15, 32);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.5 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 2.67;
    this.productGroup.add(cap);
  }

  // ── Texture Generator ────────────────────────────────────

  private makeTextTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = this.activeColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If an uploaded image exists, draw it
    if (this.uploadedImg) {
      const img = this.uploadedImg;
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8;
      const iw = img.width * scale;
      const ih = img.height * scale;
      ctx.drawImage(img, (canvas.width - iw) / 2, (canvas.height - ih) / 2, iw, ih);
    }

    // Draw custom text
    ctx.fillStyle = this.activeTextColor();
    ctx.font = `bold ${this.fontSize()}px Playfair Display, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textY = this.uploadedImg ? canvas.height * 0.85 : canvas.height / 2;
    ctx.fillText(this.customText(), canvas.width / 2, textY);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }

  // ── Public Actions ───────────────────────────────────────

  setProduct(type: ProductType): void {
    this.activeProduct.set(type);
    this.rebuildProduct();
  }

  setColor(hex: string): void {
    this.activeColor.set(hex);
    this.rebuildProduct();
  }

  setTextColor(hex: string): void {
    this.activeTextColor.set(hex);
    this.rebuildProduct();
  }

  updateText(event: Event): void {
    this.customText.set((event.target as HTMLInputElement).value);
    this.rebuildProduct();
  }

  // ── Upload Handlers ──────────────────────────────────────

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.loadImageFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.loadImageFile(file);
      }
    }
  }

  removeUpload(): void {
    this.uploadedImage.set(null);
    this.uploadedImg = null;
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
    this.rebuildProduct();
  }

  private loadImageFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      this.uploadedImage.set(dataUrl);

      const img = new Image();
      img.onload = () => {
        this.uploadedImg = img;
        this.rebuildProduct();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  // ── Rebuild ──────────────────────────────────────────────

  private rebuildProduct(): void {
    this.buildProduct();
  }

  // ── Helpers ──────────────────────────────────────────────

  getCanvasHint(): string {
    const labels: Record<ProductType, string> = {
      mug: 'Mug',
      tshirt: 'T-Shirt',
      frame: 'Frame',
      bottle: 'Bottle',
    };
    return `${labels[this.activeProduct()]} rotates automatically — customize using the panel`;
  }
}
