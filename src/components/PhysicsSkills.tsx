import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as Matter from 'matter-js';

const SKILLS = ['Golang', 'Kubernetes', 'Docker', 'React', 'Linux', 'gRPC', 'Postgres'];

interface SkillBody extends Matter.Body {
  label?: string;
}

export default function PhysicsSkills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<SkillBody[]>([]);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const containerWidth = canvas.parentElement?.offsetWidth || 800;
    const containerHeight = window.innerWidth < 768 ? 350 : 500;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;
    const MouseConstraint = Matter.MouseConstraint;
    const Mouse = Matter.Mouse;

    const engine = Engine.create();
    engineRef.current = engine;

    engine.world.gravity.y = 1;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const wallThickness = 50;

    const walls = [
      Bodies.rectangle(containerWidth / 2, containerHeight + wallThickness / 2, containerWidth + 100, wallThickness, { isStatic: true, friction: 0.5 }),
      Bodies.rectangle(-wallThickness / 2, containerHeight / 2, wallThickness, containerHeight, { isStatic: true, friction: 0.5 }),
      Bodies.rectangle(containerWidth + wallThickness / 2, containerHeight / 2, wallThickness, containerHeight, { isStatic: true, friction: 0.5 }),
    ];

    bodiesRef.current = [];

    const skillBodies: SkillBody[] = SKILLS.map((skill, index) => {
      const isMobile = window.innerWidth < 768;
      const blockWidth = isMobile ? 80 : 100;
      const blockHeight = isMobile ? 50 : 60;

      const x = (index + 0.5) * (containerWidth / SKILLS.length) + Math.random() * 20 - 10;
      const y = 60 + Math.random() * 40;

      const body = Bodies.rectangle(x, y, blockWidth, blockHeight, {
        restitution: 0.9,
        density: 0.04,
        friction: 0.5,
        frictionAir: 0.02,
        chamfer: { radius: 8 },
      }) as SkillBody;

      body.label = skill;
      return body;
    });

    bodiesRef.current = [...walls, ...skillBodies];

    World.add(engine.world, bodiesRef.current);

    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { isVisible: false },
      },
    }) as Matter.MouseConstraint;

    mouseConstraintRef.current = mouseConstraint;
    World.add(engine.world, mouseConstraint);

    const render = () => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;

      skillBodies.forEach((body) => {
        const vertices = body.vertices;
        const angle = body.angle;

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(angle);

        ctx.fillStyle = '#18181b';
        ctx.strokeStyle = '#3f3f46';

        ctx.beginPath();
        ctx.moveTo(vertices[0].x - body.position.x, vertices[0].y - body.position.y);
        for (let i = 1; i < vertices.length; i++) {
          ctx.lineTo(vertices[i].x - body.position.x, vertices[i].y - body.position.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(body.label || '', 0, 0);

        ctx.restore();
      });

      Engine.update(engine);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      const newWidth = canvas.parentElement?.offsetWidth || 800;
      const newHeight = window.innerWidth < 768 ? 350 : 500;

      if (newWidth !== canvas.width || newHeight !== canvas.height) {
        canvas.width = newWidth;
        canvas.height = newHeight;

        bodiesRef.current.forEach((body) => {
          World.remove(engine.world, body);
        });

        const newWalls = [
          Bodies.rectangle(newWidth / 2, newHeight + wallThickness / 2, newWidth + 100, wallThickness, { isStatic: true, friction: 0.5 }),
          Bodies.rectangle(-wallThickness / 2, newHeight / 2, wallThickness, newHeight, { isStatic: true, friction: 0.5 }),
          Bodies.rectangle(newWidth + wallThickness / 2, newHeight / 2, wallThickness, newHeight, { isStatic: true, friction: 0.5 }),
        ];

        const newSkillBodies: SkillBody[] = SKILLS.map((skill, index) => {
          const isMobile = window.innerWidth < 768;
          const blockWidth = isMobile ? 80 : 100;
          const blockHeight = isMobile ? 50 : 60;

          const x = (index + 0.5) * (newWidth / SKILLS.length) + Math.random() * 20 - 10;
          const y = 60 + Math.random() * 40;

          const body = Bodies.rectangle(x, y, blockWidth, blockHeight, {
            restitution: 0.9,
            density: 0.04,
            friction: 0.5,
            frictionAir: 0.02,
            chamfer: { radius: 8 },
          }) as SkillBody;

          body.label = skill;
          return body;
        });

        bodiesRef.current = [...newWalls, ...newSkillBodies];
        World.add(engine.world, bodiesRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (engineRef.current) {
        bodiesRef.current.forEach((body) => {
          World.remove(engineRef.current!.world, body);
        });

        if (mouseConstraintRef.current) {
          World.remove(engineRef.current.world, mouseConstraintRef.current);
        }

        Events.off(engineRef.current);
      }
    };
  }, []);

  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-zinc-100 mb-8 text-center"
        >
          Tech Stack
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-lg overflow-hidden bg-zinc-900"
        >
          <canvas
            ref={canvasRef}
            className="w-full block cursor-grab active:cursor-grabbing"
          />
        </motion.div>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Click and drag the skill blocks to interact with the physics sandbox
        </p>
      </div>
    </section>
  );
}
