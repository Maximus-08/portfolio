import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as Matter from 'matter-js';

const SKILLS = ['Golang', 'Kubernetes', 'Docker', 'React', 'TypeScript', 'Linux', 'Python', 'Javascript', 'Git', 'Github', 'C++'];

interface SkillBody extends Matter.Body {
  label: string;
  width?: number;
  height?: number;
}

export default function PhysicsSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  // Track if we have already initialized for the current view session
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = window.innerWidth < 768 ? 400 : 600;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const Engine = Matter.Engine;
    // Render not used
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;
    const MouseConstraint = Matter.MouseConstraint;
    const Mouse = Matter.Mouse;
    const Composite = Matter.Composite;

    // Create engine
    const engine = Engine.create();
    engine.world.gravity.y = 1;
    engineRef.current = engine;

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;

    // Walls
    const wallThickness = 60;
    const ground = Bodies.rectangle(containerWidth / 2, containerHeight + wallThickness / 2 - 10, containerWidth + 200, wallThickness, {
      isStatic: true,
      render: { visible: false }
    });
    const leftWall = Bodies.rectangle(-wallThickness / 2, containerHeight / 2, wallThickness, containerHeight * 2, {
      isStatic: true,
      render: { visible: false }
    });
    const rightWall = Bodies.rectangle(containerWidth + wallThickness / 2, containerHeight / 2, wallThickness, containerHeight * 2, {
      isStatic: true,
      render: { visible: false }
    });

    World.add(engine.world, [ground, leftWall, rightWall]);

    // Mouse Interaction
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    // Remove mouse wheel scroll capture
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    World.add(engine.world, mouseConstraint);

    // Custom Render Loop
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    const renderLoop = () => {
      if (!ctx || !engineRef.current) return;

      const bodies = Composite.allBodies(engineRef.current.world);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bodies
      bodies.forEach((body) => {
        if (body.render.visible === false) return; // Skip walls

        const skillBody = body as SkillBody;
        const { x, y } = body.position;
        const angle = body.angle;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Draw Block
        const width = skillBody.width || 100; // Fallback
        const height = skillBody.height || 60; // Fallback

        ctx.beginPath();
        // Draw rounded rectangle manually or use the vertices
        // Using vertices ensures accurate representation of physics body
        if (body.vertices && body.vertices.length > 0) {
          ctx.moveTo(body.vertices[0].x - x, body.vertices[0].y - y);
          for (let j = 1; j < body.vertices.length; j++) {
            ctx.lineTo(body.vertices[j].x - x, body.vertices[j].y - y);
          }
          ctx.closePath();
        } else {
          ctx.rect(-width / 2, -height / 2, width, height);
        }

        const isHovered = Matter.Query.point([body], mouse.position).length > 0;

        ctx.fillStyle = isHovered ? '#27272a' : '#18181b'; // zinc-800 : zinc-900
        ctx.strokeStyle = '#3f3f46'; // zinc-700
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Draw Text
        // We cancel rotation for text to keep it upright if desired, 
        // BUT user asked for "names of skills on the block ar always top up".
        // If we lock rotation of the body (inertia: Infinity), the body won't rotate, so text follows naturally.
        ctx.fillStyle = '#f4f4f5'; // zinc-100
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(skillBody.label || '', 0, 0);

        ctx.restore();
      });

      Runner.tick(runner, engine, 1000 / 60);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  // Handle Reset and Staggered Spawn
  useEffect(() => {
    if (!isInView || !engineRef.current) {
      initializedRef.current = false;
      return;
    };

    if (initializedRef.current) return;
    initializedRef.current = true;

    const engine = engineRef.current;

    // Clear existing dynamic bodies (skills) but keep walls
    const allBodies = Matter.Composite.allBodies(engine.world);
    // Filter by static to keep walls
    const dynamicBodies = allBodies.filter(b => !b.isStatic && b.label !== 'Mouse Constraint');
    Matter.World.remove(engine.world, dynamicBodies);

    // Spawn Logic
    const containerWidth = canvasRef.current?.width || 800;

    SKILLS.forEach((skill, index) => {
      setTimeout(() => {
        if (!engineRef.current) return;

        const isMobile = window.innerWidth < 768;
        const width = isMobile ? 90 : 120;
        const height = isMobile ? 45 : 50;

        // Random x within center area to ensure stacking
        // center is containerWidth / 2
        // Spawn range: center +/- 20px
        const x = containerWidth / 2 + (Math.random() - 0.5) * 40;
        const y = -100; // Start above screen

        const body = Matter.Bodies.rectangle(x, y, width, height, {
          label: skill,
          chamfer: { radius: 10 },
          restitution: 0.2, // Low bounciness for stacking
          friction: 0.5,
          density: 0.002, // Lighter density
          inertia: Infinity, // PREVENT ROTATION
          frictionAir: 0.05 // Air resistance to slow down fall slightly
        }) as SkillBody;

        body.width = width;
        body.height = height;

        Matter.World.add(engine.world, body);
      }, index * 200); // 200ms stagger
    });

  }, [isInView]);

  return (
    <section ref={containerRef} id="tech-stack" className="bg-zinc-950 py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-zinc-100 mb-12 text-center"
        >
          Tech Stack
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full rounded-xl overflow-hidden bg-zinc-900/30 border border-white/5"
        >
          <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
        </motion.div>
      </div>
    </section>
  );
}
