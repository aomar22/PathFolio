lucide.createIcons();

const animateProgressBars = () => {
  document.querySelectorAll('.progress-fill').forEach((bar) => {
    const target = bar.style.getPropertyValue('--value');
    requestAnimationFrame(() => {
      bar.style.width = target;
    });
  });
};

const animateOverallRing = () => {
  const ring = document.getElementById('overallRing');
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const percent = 78;

  ring.style.strokeDasharray = `${circumference}`;
  ring.style.strokeDashoffset = `${circumference}`;

  requestAnimationFrame(() => {
    ring.style.transition = 'stroke-dashoffset 1.35s ease';
    ring.style.strokeDashoffset = `${circumference * (1 - percent / 100)}`;
  });
};

const drawRadar = () => {
  const canvas = document.getElementById('skillRadar');
  const ctx = canvas.getContext('2d');
  const labels = ['Frontend', 'Backend', 'Database', 'DevOps', 'Problem Solving', 'Teamwork'];
  const values = [80, 74, 72, 56, 84, 78];

  let hoverIndex = -1;

  const render = () => {
    const { width, height } = canvas;
    const center = { x: width / 2, y: height / 2 + 4 };
    const radius = 92;
    const levels = 5;
    const angleStep = (Math.PI * 2) / labels.length;

    ctx.clearRect(0, 0, width, height);

    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      ctx.beginPath();
      for (let i = 0; i < labels.length; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const x = center.x + Math.cos(angle) * r;
        const y = center.y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    labels.forEach((label, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.stroke();

      const labelR = radius + 18;
      const lx = center.x + Math.cos(angle) * labelR;
      const ly = center.y + Math.sin(angle) * labelR;
      ctx.fillStyle = hoverIndex === i ? '#ffffff' : '#aab3c5';
      ctx.font = hoverIndex === i ? '600 12px Inter' : '500 12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(label, lx, ly);
    });

    ctx.beginPath();
    values.forEach((val, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const r = (val / 100) * radius;
      const x = center.x + Math.cos(angle) * r;
      const y = center.y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(108,99,255,0.26)';
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    values.forEach((val, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const r = (val / 100) * radius;
      const x = center.x + Math.cos(angle) * r;
      const y = center.y + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, hoverIndex === i ? 5.5 : 4, 0, Math.PI * 2);
      ctx.fillStyle = hoverIndex === i ? '#ffffff' : '#00d4ff';
      ctx.fill();
    });
  };

  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const center = { x: canvas.width / 2, y: canvas.height / 2 + 4 };
    const dx = x - center.x;
    const dy = y - center.y;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    const index = Math.round(angle / ((Math.PI * 2) / labels.length)) % labels.length;
    hoverIndex = index;
    render();
  });

  canvas.addEventListener('mouseleave', () => {
    hoverIndex = -1;
    render();
  });

  render();
};

animateProgressBars();
animateOverallRing();
drawRadar();
