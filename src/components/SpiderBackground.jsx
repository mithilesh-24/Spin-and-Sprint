import React, { useEffect, useRef } from 'react';

export default function SpiderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Spiderweb nodes
    const nodeCount = 35;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.6 ? '#E23636' : '#00D2FF',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle comic web lines connecting nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const alpha = (1 - dist / 150) * 0.18;
            ctx.strokeStyle = `rgba(226, 54, 54, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Background Base: Dark or Crisp Light */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070b18] via-[#050811] to-[#020408] transition-opacity duration-300 dark-bg-base" />

      {/* Light Theme Background Canvas Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] opacity-0 transition-opacity duration-300 light-bg-base" />

      {/* Spider-Man Corner Web SVGs */}
      <div className="absolute top-0 left-0 w-72 h-72 opacity-25">
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-red-600/40 fill-none" strokeWidth="1">
          <path d="M0,0 Q100,20 200,0 M0,0 Q20,100 0,200 M0,0 L180,180 M0,0 L140,200 M0,0 L200,140" />
          <path d="M0,40 Q40,40 40,0 M0,80 Q80,80 80,0 M0,120 Q120,120 120,0 M0,160 Q160,160 160,0" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-72 h-72 opacity-25 -scale-x-100">
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-cyan-500/40 fill-none" strokeWidth="1">
          <path d="M0,0 Q100,20 200,0 M0,0 Q20,100 0,200 M0,0 L180,180 M0,0 L140,200 M0,0 L200,140" />
          <path d="M0,40 Q40,40 40,0 M0,80 Q80,80 80,0 M0,120 Q120,120 120,0 M0,160 Q160,160 160,0" />
        </svg>
      </div>

      {/* Comic Halftone Texture Overlay */}
      <div className="absolute inset-0 comic-halftone opacity-40 mix-blend-screen" />

      {/* Canvas Web Nodes */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Glowing atmospheric orbs */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
    </div>
  );
}
