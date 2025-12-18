import { useGameStore } from '../store/gameStore';

interface Position {
  x: number;
  y: number;
}

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export default class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;

  // Game state
  private car: Position;
  private carWidth: number = 60;
  private carHeight: number = 80;
  private carSpeed: number = 5;
  private roadWidth: number = 300;
  private roadX: number = 0;

  // Blocks
  private blocks: Block[] = [];
  private blockSpawnRate: number = 2000; // milliseconds
  private lastBlockSpawn: number = 0;
  private blockSpeed: number = 3;
  private blockSpeedIncrease: number = 0.0001;

  // Input
  private keys: Set<string> = new Set();
  private touchStartX: number = 0;
  private touchCurrentX: number = 0;

  // Game stats
  private startTime: number = 0;
  private gameDistance: number = 0;

  public onGameOver?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    this.ctx = ctx;

    // Set canvas size
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Initialize car position
    this.car = {
      x: canvas.width / 2 - this.carWidth / 2,
      y: canvas.height - this.carHeight - 20,
    };

    // Setup input handlers
    this.setupInput();
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    // Recalculate road width
    this.roadWidth = Math.min(300, rect.width * 0.8);
    this.roadX = (rect.width - this.roadWidth) / 2;

    // Adjust car position
    this.car.x = Math.max(
      this.roadX + 10,
      Math.min(
        this.roadX + this.roadWidth - this.carWidth - 10,
        this.car.x
      )
    );
  }

  private setupInput() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
      if (e.key === ' ') {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
    });

    // Touch
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchCurrentX = touch.clientX;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touchCurrentX = touch.clientX;
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const deltaX = this.touchCurrentX - this.touchStartX;
      if (Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
          this.keys.add('ArrowRight');
          setTimeout(() => this.keys.delete('ArrowRight'), 100);
        } else {
          this.keys.add('ArrowLeft');
          setTimeout(() => this.keys.delete('ArrowLeft'), 100);
        }
      }
      this.touchStartX = 0;
      this.touchCurrentX = 0;
    });
  }

  private handleInput() {
    const moveSpeed = this.carSpeed;
    const leftBound = this.roadX + 10;
    const rightBound = this.roadX + this.roadWidth - this.carWidth - 10;

    if (this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A')) {
      this.car.x = Math.max(leftBound, this.car.x - moveSpeed);
    }
    if (this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D')) {
      this.car.x = Math.min(rightBound, this.car.x + moveSpeed);
    }
  }

  private spawnBlock() {
    const now = Date.now();
    if (now - this.lastBlockSpawn < this.blockSpawnRate) return;

    const blockWidth = 50 + Math.random() * 30;
    const blockHeight = 50 + Math.random() * 30;
    const x = this.roadX + Math.random() * (this.roadWidth - blockWidth);
    
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    this.blocks.push({
      x,
      y: -blockHeight,
      width: blockWidth,
      height: blockHeight,
      color,
    });

    this.lastBlockSpawn = now;
  }

  private updateBlocks(deltaTime: number) {
    // Increase block speed over time
    this.blockSpeed += this.blockSpeedIncrease * deltaTime;

    // Move blocks down
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      const block = this.blocks[i];
      block.y += this.blockSpeed * (deltaTime / 16);

      // Remove blocks that are off screen
      if (block.y > this.canvas.height) {
        this.blocks.splice(i, 1);
        useGameStore.getState().incrementBlocksAvoided();
        useGameStore.getState().incrementScore(10);
      }
    }
  }

  private checkCollisions(): boolean {
    const carRect = {
      x: this.car.x,
      y: this.car.y,
      width: this.carWidth,
      height: this.carHeight,
    };

    for (const block of this.blocks) {
      if (
        carRect.x < block.x + block.width &&
        carRect.x + carRect.width > block.x &&
        carRect.y < block.y + block.height &&
        carRect.y + carRect.height > block.y
      ) {
        return true;
      }
    }

    return false;
  }

  private updateStats(deltaTime: number) {
    const currentTime = Date.now();
    if (this.startTime === 0) {
      this.startTime = currentTime;
    }

    const elapsed = currentTime - this.startTime;
    useGameStore.getState().setTime(elapsed);

    // Update distance (based on time and speed)
    this.gameDistance += (this.blockSpeed * deltaTime) / 10;
    useGameStore.getState().setDistance(this.gameDistance);

    // Update score based on distance
    const score = Math.floor(this.gameDistance * 0.1);
    useGameStore.getState().setScore(score);
  }

  private render() {
    // Clear canvas
    this.ctx.fillStyle = '#111827';
    this.ctx.fillRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), this.canvas.height / (window.devicePixelRatio || 1));

    // Draw road
    this.ctx.fillStyle = '#1f2937';
    this.ctx.fillRect(
      this.roadX,
      0,
      this.roadWidth,
      this.canvas.height / (window.devicePixelRatio || 1)
    );

    // Draw road lines
    this.ctx.strokeStyle = '#fbbf24';
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([20, 20]);
    const centerX = this.roadX + this.roadWidth / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, 0);
    this.ctx.lineTo(centerX, this.canvas.height / (window.devicePixelRatio || 1));
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw road borders
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(this.roadX, 0);
    this.ctx.lineTo(this.roadX, this.canvas.height / (window.devicePixelRatio || 1));
    this.ctx.moveTo(this.roadX + this.roadWidth, 0);
    this.ctx.lineTo(this.roadX + this.roadWidth, this.canvas.height / (window.devicePixelRatio || 1));
    this.ctx.stroke();

    // Draw blocks
    for (const block of this.blocks) {
      this.ctx.fillStyle = block.color;
      this.ctx.fillRect(block.x, block.y, block.width, block.height);
      
      // Block border
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(block.x, block.y, block.width, block.height);
    }

    // Draw car
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillRect(this.car.x, this.car.y, this.carWidth, this.carHeight);
    
    // Car details
    this.ctx.fillStyle = '#1e40af';
    this.ctx.fillRect(this.car.x + 10, this.car.y + 10, this.carWidth - 20, 20);
    this.ctx.fillRect(this.car.x + 10, this.car.y + 50, this.carWidth - 20, 20);
    
    // Car windows
    this.ctx.fillStyle = '#60a5fa';
    this.ctx.fillRect(this.car.x + 15, this.car.y + 15, this.carWidth - 30, 15);
  }

  private gameLoop = (currentTime: number) => {
    if (!this.isRunning || this.isPaused) {
      if (this.isRunning) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
      }
      return;
    }

    const deltaTime = currentTime - this.lastTime || 16;
    this.lastTime = currentTime;

    // Update
    this.handleInput();
    this.spawnBlock();
    this.updateBlocks(deltaTime);
    this.updateStats(deltaTime);

    // Check collisions
    if (this.checkCollisions()) {
      this.stop();
      if (this.onGameOver) {
        this.onGameOver();
      }
      return;
    }

    // Render
    this.render();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.startTime = 0;
    this.gameDistance = 0;
    this.blocks = [];
    this.blockSpeed = 3;
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    if (this.isRunning) {
      this.lastTime = performance.now();
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
  }
}

