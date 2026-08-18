document.addEventListener('DOMContentLoaded', () => {

  // --- Smooth Scroll Button ---
  const simBtn = document.getElementById('simBtn');
  if (simBtn) {
    simBtn.addEventListener('click', () => {
      document.getElementById('simulation').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Hardware Tabs Functionality ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate selected tab button and content
      btn.classList.add('active');
      document.getElementById(targetTabId).classList.add('active');
    });
  });

  // --- Interactive Tracking Simulation ---
  const canvas = document.getElementById('simCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth - 48;
    canvas.height = 320;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let customer = { x: canvas.width / 2, y: canvas.height / 2 };
  let cart = { x: canvas.width / 4, y: canvas.height / 2, speed: 2.5 };
  const SAFE_DISTANCE = 50;

  // Track Mouse Movement
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    customer.x = e.clientX - rect.left;
    customer.y = e.clientY - rect.top;
  });

  // Track Touch Movement
  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    customer.x = e.touches[0].clientX - rect.left;
    customer.y = e.touches[0].clientY - rect.top;
  });

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Distance calculation
    const dx = customer.x - cart.x;
    const dy = customer.y - cart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Cart Motion Logic
    if (dist > SAFE_DISTANCE) {
      const angle = Math.atan2(dy, dx);
      cart.x += Math.cos(angle) * cart.speed;
      cart.y += Math.sin(angle) * cart.speed;
    }

    // Draw Connection Line
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(cart.x, cart.y);
    ctx.lineTo(customer.x, customer.y);
    ctx.strokeStyle = '#30363d';
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Safe Distance Boundary
    ctx.beginPath();
    ctx.arc(customer.x, customer.y, SAFE_DISTANCE, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(248, 81, 73, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Customer (Green)
    ctx.beginPath();
    ctx.arc(customer.x, customer.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#3fb950';
    ctx.fill();

    // Draw Cart (Blue)
    ctx.beginPath();
    ctx.arc(cart.x, cart.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#2f81f7';
    ctx.fill();

    requestAnimationFrame(animate);
  }

  animate();
});