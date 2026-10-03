// js/scenes/hero-scene.js — Three.js procedural hero background
// Basket node, 3 store nodes, curved connectors, travelling packets, dust particles

let THREE;

export class HeroScene {
  constructor() {
    this.container = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.clock = null;
    this.isRunning = false;
    this.isVisible = true;
    this.rafId = null;
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    this.nodes = {};
    this.packets = [];
    this.dustParticles = null;
    this.groceryMeshes = [];
    this.disposed = false;
    this.isMobile = window.innerWidth < 768;
  }

  async init(container) {
    this.container = container;

    // Feature detect WebGL
    if (!this._hasWebGL()) {
      this._showFallback();
      return false;
    }

    try {
      THREE = await import('three');
    } catch (e) {
      console.warn('Three.js failed to load:', e);
      this._showFallback();
      return false;
    }

    this._setup();
    this._buildScene();
    this._bindEvents();

    return true;
  }

  _hasWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
      return false;
    }
  }

  _showFallback() {
    this.container.innerHTML = `
      <div class="webgl-fallback">
        <div style="text-align:center; opacity:0.5">
          <div style="font-size:48px; margin-bottom:8px">🛒</div>
          <div style="font-size:12px; color:#64648c">3D visualization unavailable</div>
        </div>
      </div>
    `;
  }

  _setup() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    this.camera.position.set(0, 0, this.isMobile ? 12 : 10);

    // Scene
    this.scene = new THREE.Scene();

    // Clock
    this.clock = new THREE.Clock();

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe0e0ff, 1.2);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 8, 5);
    this.scene.add(dirLight);

    // Handle context loss
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.stop();
    });

    this.renderer.domElement.addEventListener('webglcontextrestored', () => {
      this.start();
    });
  }

  _buildScene() {
    const offset = this.isMobile ? 0 : 1.5; // Push right on desktop

    // ===== BASKET NODE =====
    const basketGroup = new THREE.Group();
    basketGroup.position.set(offset - 1, 0, 0);

    // Open basket shape
    const basketGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
    const basketMat = new THREE.MeshStandardMaterial({
      color: 0x6c47ff,
      flatShading: true,
      transparent: true,
      opacity: 0.85
    });
    const basket = new THREE.Mesh(basketGeo, basketMat);
    basketGroup.add(basket);

    // Wireframe accent
    const wireGeo = new THREE.EdgesGeometry(basketGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xa78bfa, linewidth: 1 });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    basketGroup.add(wire);

    // Grocery meshes bobbing inside basket
    const groceryDefs = [
      { geo: new THREE.BoxGeometry(0.25, 0.4, 0.2), color: 0x60a5fa, y: 0.3 },   // Milk carton
      { geo: new THREE.CylinderGeometry(0.1, 0.1, 0.35, 8), color: 0xef4444, y: 0.35 }, // Can
      { geo: new THREE.BoxGeometry(0.35, 0.06, 0.25), color: 0xf59e0b, y: 0.28 }, // Noodle pack
      { geo: new THREE.BoxGeometry(0.22, 0.3, 0.08, 2, 2, 2), color: 0x22c55e, y: 0.32 }  // Chips bag
    ];

    groceryDefs.forEach((def, i) => {
      const mat = new THREE.MeshStandardMaterial({ color: def.color, flatShading: true });
      const mesh = new THREE.Mesh(def.geo, mat);
      mesh.position.set(-0.3 + i * 0.2, def.y, 0);
      mesh.rotation.y = Math.random() * Math.PI;
      basketGroup.add(mesh);
      this.groceryMeshes.push({ mesh, baseY: def.y, phase: i * 1.3 });
    });

    this.scene.add(basketGroup);
    this.nodes.basket = basketGroup;

    // ===== STORE NODES =====
    const storeColors = [
      { id: 'blinkit', color: 0xf59e0b, pos: [offset + 2.5, 1.8, -0.5] },
      { id: 'zepto', color: 0x9333ea, pos: [offset + 3.0, 0.0, 0.5] },
      { id: 'instamart', color: 0xf97316, pos: [offset + 2.5, -1.8, -0.3] }
    ];

    storeColors.forEach(s => {
      const group = new THREE.Group();
      group.position.set(...s.pos);

      // Icosphere
      const geo = new THREE.IcosahedronGeometry(0.35, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: s.color,
        flatShading: true,
        emissive: s.color,
        emissiveIntensity: 0.15
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      // Glow sprite
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = 64;
      glowCanvas.height = 64;
      const ctx = glowCanvas.getContext('2d');
      const gradient = ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
      const hexColor = '#' + new THREE.Color(s.color).getHexString();
      gradient.addColorStop(0, hexColor + '80');
      gradient.addColorStop(0.5, hexColor + '30');
      gradient.addColorStop(1, hexColor + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const glowTex = new THREE.CanvasTexture(glowCanvas);
      const glowMat = new THREE.SpriteMaterial({
        map: glowTex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6
      });
      const sprite = new THREE.Sprite(glowMat);
      sprite.scale.set(1.5, 1.5, 1);
      group.add(sprite);

      this.scene.add(group);
      this.nodes[s.id] = { group, mesh, isWinner: s.id === 'blinkit' };
    });

    // ===== CURVED CONNECTORS + PACKETS =====
    const basketPos = basketGroup.position;
    storeColors.forEach(s => {
      const storePos = new THREE.Vector3(...s.pos);
      const mid = new THREE.Vector3(
        (basketPos.x + storePos.x) / 2,
        (basketPos.y + storePos.y) / 2 + 0.8,
        (basketPos.z + storePos.z) / 2 + 0.5
      );

      const curve = new THREE.QuadraticBezierCurve3(basketPos.clone(), mid, storePos);
      const pts = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: 0.2
      });
      const line = new THREE.Line(lineGeo, lineMat);
      this.scene.add(line);

      // Travelling packets
      for (let i = 0; i < 2; i++) {
        const pGeo = new THREE.SphereGeometry(0.06, 6, 6);
        const pMat = new THREE.MeshBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: 0.9
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        this.scene.add(pMesh);
        this.packets.push({
          mesh: pMesh,
          curve,
          t: i * 0.5,
          speed: 0.15 + Math.random() * 0.1
        });
      }
    });

    // ===== PULSING RING ON WINNER =====
    const ringGeo = new THREE.RingGeometry(0.5, 0.55, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    this.winnerRing = new THREE.Mesh(ringGeo, ringMat);
    this.winnerRing.position.set(...storeColors[0].pos);
    this.winnerRing.lookAt(this.camera.position);
    this.scene.add(this.winnerRing);

    // ===== DUST PARTICLES =====
    const dustCount = this.isMobile ? 120 : 300;
    const dustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);
    const brandColors = [
      new THREE.Color(0x6c47ff),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0x9333ea),
      new THREE.Color(0xf97316)
    ];

    for (let i = 0; i < dustCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const c = brandColors[Math.floor(Math.random() * brandColors.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    this.dustParticles = new THREE.Points(dustGeo, dustMat);
    this.scene.add(this.dustParticles);
  }

  _bindEvents() {
    // Mouse parallax
    window.addEventListener('mousemove', this._onMouseMove = (e) => {
      this.mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.4;
      this.mouse.ty = (e.clientY / window.innerHeight - 0.5) * -0.3;
    });

    // Resize
    this._resizeObserver = new ResizeObserver(() => this.resize());
    this._resizeObserver.observe(this.container);

    // Visibility
    this._intersectionObserver = new IntersectionObserver((entries) => {
      this.isVisible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0.05 });
    this._intersectionObserver.observe(this.container);

    // Tab visibility
    document.addEventListener('visibilitychange', this._onVisChange = () => {
      if (document.hidden) this.isVisible = false;
    });

    // Motion toggle
    document.addEventListener('shopmate:motion-toggle', this._onMotionToggle = (e) => {
      if (!e.detail.enabled) {
        // Render one still frame
        this._render(0);
      }
    });
  }

  start() {
    if (this.isRunning || !this.renderer) return;
    this.isRunning = true;
    this.clock?.start();
    this._animate();
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  _animate() {
    if (!this.isRunning || this.disposed) return;
    this.rafId = requestAnimationFrame(() => this._animate());

    // Skip if not visible or motion off
    if (!this.isVisible || document.body.classList.contains('motion-off')) return;

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.getElapsedTime();

    this._render(time, dt);
  }

  _render(time, dt = 0.016) {
    // Mouse parallax
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.05;
    this.camera.position.x = this.mouse.x * 2;
    this.camera.position.y = this.mouse.y * 2;
    this.camera.lookAt(this.isMobile ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(1.5, 0, 0));

    // Grocery bobbing
    this.groceryMeshes.forEach(g => {
      g.mesh.position.y = g.baseY + Math.sin(time * 1.5 + g.phase) * 0.05;
      g.mesh.rotation.y += dt * 0.3;
    });

    // Packets travel
    this.packets.forEach(p => {
      p.t = (p.t + dt * p.speed) % 1;
      const pos = p.curve.getPointAt(p.t);
      p.mesh.position.copy(pos);
      p.mesh.material.opacity = 0.3 + Math.sin(p.t * Math.PI) * 0.6;
    });

    // Winner ring pulse
    if (this.winnerRing) {
      const scale = 1 + Math.sin(time * 2) * 0.2;
      this.winnerRing.scale.set(scale, scale, 1);
      this.winnerRing.material.opacity = 0.2 + Math.sin(time * 2) * 0.2;
      this.winnerRing.lookAt(this.camera.position);
    }

    // Store nodes gentle rotation
    ['blinkit', 'zepto', 'instamart'].forEach((id, i) => {
      const node = this.nodes[id];
      if (node?.mesh) {
        node.mesh.rotation.x += dt * 0.2;
        node.mesh.rotation.y += dt * 0.3;
      }
    });

    // Dust drift
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += Math.sin(time + i) * 0.001;
        pos[i] += Math.cos(time * 0.5 + i) * 0.0005;
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
      this.dustParticles.rotation.y = time * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose() {
    this.disposed = true;
    this.stop();

    window.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('visibilitychange', this._onVisChange);
    document.removeEventListener('shopmate:motion-toggle', this._onMotionToggle);
    this._resizeObserver?.disconnect();
    this._intersectionObserver?.disconnect();

    // Dispose Three.js resources
    if (this.scene) {
      this.scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => { m.dispose(); if (m.map) m.map.dispose(); });
          } else {
            obj.material.dispose();
            if (obj.material.map) obj.material.map.dispose();
          }
        }
      });
    }

    this.renderer?.dispose();
    if (this.renderer?.domElement) {
      this.renderer.domElement.remove();
    }
  }
}

// ===== AUTO-INIT =====
async function autoInit() {
  const container = document.getElementById('hero-canvas-container');
  if (!container) return;

  const scene = new HeroScene();
  const ok = await scene.init(container);
  if (ok) scene.start();

  // Store reference for cleanup
  window.__heroScene = scene;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(autoInit, 200));
} else {
  setTimeout(autoInit, 200);
}
