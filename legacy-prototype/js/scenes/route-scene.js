// js/scenes/route-scene.js — Three.js routing visualization for comparison dashboard
// Basket node left, 3 store nodes right at ETA-proportional distances

let THREE;

export class RouteScene {
  constructor() {
    this.container = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.clock = null;
    this.isRunning = false;
    this.isVisible = false;
    this.rafId = null;
    this.nodes = {};
    this.packets = [];
    this.disposed = false;
    this.winner = 'blinkit';
    this.routeState = 'idle'; // idle | routing | complete
  }

  async init(container) {
    this.container = container;

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
      <div class="webgl-fallback" style="height:100%">
        <div style="text-align:center; opacity:0.4">
          <div style="font-size:32px; margin-bottom:8px">🗺️</div>
          <div style="font-size:11px; color:#64648c">Route visualization unavailable</div>
        </div>
      </div>
    `;
  }

  _setup() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.set(0, 0, 12);
    this.camera.lookAt(1, 0, 0);

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(3, 5, 5);
    this.scene.add(dir);

    // Context loss
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.stop();
    });
  }

  _buildScene() {
    // ===== BASKET NODE (left) =====
    const basketGroup = new THREE.Group();
    basketGroup.position.set(-4, 0, 0);

    const basketGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
    const basketMat = new THREE.MeshStandardMaterial({
      color: 0x6c47ff,
      flatShading: true
    });
    const basketMesh = new THREE.Mesh(basketGeo, basketMat);
    basketGroup.add(basketMesh);

    // Label ring
    const ringGeo = new THREE.RingGeometry(0.55, 0.6, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6c47ff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.lookAt(this.camera.position);
    basketGroup.add(ring);

    this.scene.add(basketGroup);
    this.nodes.basket = basketGroup;

    // ===== STORE NODES (right, distances proportional to ETA) =====
    const stores = [
      { id: 'blinkit',   color: 0xf59e0b, eta: 10, y:  1.8 },
      { id: 'zepto',     color: 0x9333ea, eta:  8, y:  0.0 },
      { id: 'instamart', color: 0xf97316, eta: 12, y: -1.8 }
    ];

    stores.forEach(s => {
      const x = 1 + (s.eta / 12) * 3; // Proportional to ETA
      const group = new THREE.Group();
      group.position.set(x, s.y, 0);

      const geo = new THREE.IcosahedronGeometry(0.3, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: s.color,
        flatShading: true,
        emissive: s.color,
        emissiveIntensity: 0.1
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      // Glow
      const glowCanvas = document.createElement('canvas');
      glowCanvas.width = 64;
      glowCanvas.height = 64;
      const ctx = glowCanvas.getContext('2d');
      const gradient = ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
      const hc = '#' + new THREE.Color(s.color).getHexString();
      gradient.addColorStop(0, hc + '60');
      gradient.addColorStop(1, hc + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const glowTex = new THREE.CanvasTexture(glowCanvas);
      const glowSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTex,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.5
        })
      );
      glowSprite.scale.set(1.2, 1.2, 1);
      group.add(glowSprite);

      this.scene.add(group);
      this.nodes[s.id] = {
        group,
        mesh,
        originalPos: new THREE.Vector3(x, s.y, 0),
        originalScale: 1,
        color: s.color
      };

      // Curve from basket to store
      const startPos = basketGroup.position.clone();
      const endPos = new THREE.Vector3(x, s.y, 0);
      const mid = new THREE.Vector3(
        (startPos.x + endPos.x) / 2,
        (startPos.y + endPos.y) / 2 + 0.5,
        1
      );
      const curve = new THREE.QuadraticBezierCurve3(startPos, mid, endPos);
      const curvePts = curve.getPoints(30);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
      const lineMat = new THREE.LineBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: 0.15
      });
      this.scene.add(new THREE.Line(lineGeo, lineMat));

      // Pre-create packet meshes for this route
      for (let i = 0; i < 3; i++) {
        const pGeo = new THREE.SphereGeometry(0.05, 6, 6);
        const pMat = new THREE.MeshBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: 0
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        this.scene.add(pMesh);
        this.packets.push({
          mesh: pMesh,
          curve,
          t: 0,
          speed: 0.2 + Math.random() * 0.1,
          active: false,
          storeId: s.id,
          delay: i * 0.3
        });
      }
    });

    // ===== WINNER SHOCK RING =====
    const shockGeo = new THREE.RingGeometry(0.4, 0.45, 32);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.shockRing = new THREE.Mesh(shockGeo, shockMat);
    this.shockRing.lookAt(this.camera.position);
    this.scene.add(this.shockRing);

    // Gentle idle particles
    const pCount = 60;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x6c47ff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    this.bgParticles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.bgParticles);
  }

  _bindEvents() {
    // Resize
    this._resizeObserver = new ResizeObserver(() => this.resize());
    this._resizeObserver.observe(this.container);

    // Visibility
    this._intersectionObserver = new IntersectionObserver((entries) => {
      this.isVisible = entries[0]?.isIntersecting ?? false;
    }, { threshold: 0.05 });
    this._intersectionObserver.observe(this.container);

    // Route events
    document.addEventListener('shopmate:route-start', this._onRouteStart = () => {
      this.routeState = 'routing';
      // Activate all packets
      this.packets.forEach((p, i) => {
        p.active = true;
        p.t = 0;
      });
    });

    document.addEventListener('shopmate:route-step', this._onRouteStep = (e) => {
      // Flicker nodes
      const idx = e.detail.index;
      const ids = ['blinkit', 'zepto', 'instamart'];
      if (ids[idx]) {
        const node = this.nodes[ids[idx]];
        if (node?.mesh) {
          node.mesh.material.emissiveIntensity = 0.5;
          setTimeout(() => { if (node.mesh) node.mesh.material.emissiveIntensity = 0.1; }, 300);
        }
      }
    });

    document.addEventListener('shopmate:route-complete', this._onRouteComplete = (e) => {
      this.routeState = 'complete';
      this.winner = e.detail.winner;
      this._showWinner(this.winner);
    });

    document.addEventListener('shopmate:mode-change', this._onModeChange = (e) => {
      this.winner = e.detail.winner;
      this._showWinner(this.winner);
    });

    document.addEventListener('visibilitychange', this._onVisChange = () => {
      if (document.hidden) this.isVisible = false;
    });
  }

  _showWinner(winnerId) {
    const ids = ['blinkit', 'zepto', 'instamart'];

    ids.forEach(id => {
      const node = this.nodes[id];
      if (!node) return;

      if (id === winnerId) {
        // Scale up winner
        if (typeof gsap !== 'undefined') {
          gsap.to(node.group.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.5, ease: 'back.out(2)' });
        } else {
          node.group.scale.setScalar(1.4);
        }
        node.mesh.material.emissiveIntensity = 0.3;

        // Shock ring
        this.shockRing.position.copy(node.originalPos);
        this.shockRing.material.color.set(node.color);
        this.shockRing.material.opacity = 0.6;
        this.shockRing.scale.setScalar(1);

        if (typeof gsap !== 'undefined') {
          gsap.to(this.shockRing.scale, { x: 3, y: 3, z: 3, duration: 0.8, ease: 'power2.out' });
          gsap.to(this.shockRing.material, { opacity: 0, duration: 0.8, ease: 'power2.out' });
        }
      } else {
        // Dim losers
        if (typeof gsap !== 'undefined') {
          gsap.to(node.group.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.5 });
        } else {
          node.group.scale.setScalar(0.8);
        }
        node.mesh.material.emissiveIntensity = 0.02;
        node.mesh.material.opacity = 0.4;
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

    if (!this.isVisible || document.body.classList.contains('motion-off')) return;

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.getElapsedTime();

    // Idle breathing on store nodes
    ['blinkit', 'zepto', 'instamart'].forEach((id, i) => {
      const node = this.nodes[id];
      if (!node) return;
      node.mesh.rotation.x += dt * 0.2;
      node.mesh.rotation.y += dt * 0.3;

      if (this.routeState === 'idle') {
        const breathe = 1 + Math.sin(time * 1.5 + i * 2) * 0.05;
        node.group.scale.setScalar(breathe);
      }
    });

    // Basket bob
    if (this.nodes.basket) {
      this.nodes.basket.position.y = Math.sin(time * 1.2) * 0.1;
    }

    // Packets
    this.packets.forEach(p => {
      if (!p.active && this.routeState !== 'routing') return;

      if (this.routeState === 'routing' || this.routeState === 'complete') {
        p.t += dt * p.speed;
        if (p.t > 1) {
          if (this.routeState === 'routing') {
            p.t = 0; // Loop during routing
          } else {
            p.active = false;
            p.mesh.material.opacity = 0;
            return;
          }
        }
        const pos = p.curve.getPointAt(Math.min(p.t, 1));
        p.mesh.position.copy(pos);
        p.mesh.material.opacity = 0.4 + Math.sin(p.t * Math.PI) * 0.5;
      }
    });

    // Background particles drift
    if (this.bgParticles) {
      this.bgParticles.rotation.y = time * 0.01;
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

    document.removeEventListener('shopmate:route-start', this._onRouteStart);
    document.removeEventListener('shopmate:route-step', this._onRouteStep);
    document.removeEventListener('shopmate:route-complete', this._onRouteComplete);
    document.removeEventListener('shopmate:mode-change', this._onModeChange);
    document.removeEventListener('visibilitychange', this._onVisChange);
    this._resizeObserver?.disconnect();
    this._intersectionObserver?.disconnect();

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
  const container = document.getElementById('route-canvas-container');
  if (!container) return;

  const scene = new RouteScene();
  const ok = await scene.init(container);
  if (ok) scene.start();

  window.__routeScene = scene;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(autoInit, 500));
} else {
  setTimeout(autoInit, 500);
}
