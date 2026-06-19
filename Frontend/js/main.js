// ─────────────────────────────────────────────
// ERASYNC — main.js
// ─────────────────────────────────────────────


// ─────────────────────────────────────────
// 1. SIDE DRAWER
// Hamburger opens it, close button and
// clicking the overlay both close it.
// ─────────────────────────────────────────
const hamburgerBtn  = document.getElementById('hamburgerBtn');
const sideDrawer    = document.getElementById('sideDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose   = document.getElementById('drawerClose');

function openDrawer() {
  sideDrawer.classList.add('open');
  drawerOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent page scroll while drawer is open
}

function closeDrawer() {
  sideDrawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  document.body.style.overflow = ''; // restore scroll
}

if (hamburgerBtn)  hamburgerBtn.addEventListener('click', openDrawer);
if (drawerClose)   drawerClose.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);


// ─────────────────────────────────────────
// 2. GENERATION PILL TOGGLE
// ─────────────────────────────────────────
const genPills = document.querySelectorAll('.gen-pill');

genPills.forEach(pill => {
  pill.addEventListener('click', () => {
    genPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});


// ─────────────────────────────────────────
// 3. NAV LINK ACTIVE STATE
// ─────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link-item');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});


// ─────────────────────────────────────────
// 4. LOGIN / SIGNUP BUTTONS
// TODO: replace with actual navigation once
// login.html and register.html are built.
// ─────────────────────────────────────────
const btnLogins  = document.querySelectorAll('.btn-login');
const btnSignups = document.querySelectorAll('.btn-signup');

btnLogins.forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = "login.html";
  });
});

btnSignups.forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = "register.html";
  });
});