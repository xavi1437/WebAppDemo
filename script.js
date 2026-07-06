const menuButton = document.querySelector('.mobile-menu-button');
const navLinks = document.querySelector('[data-nav-links]');

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const stepCards = document.querySelectorAll('.step-card');
stepCards.forEach((card) => {
  card.addEventListener('click', () => {
    stepCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
  });
});

const signupForm = document.querySelector('[data-signup-form]');
const formMessage = document.querySelector('[data-form-message]');

signupForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(signupForm);
  const name = data.get('name') || 'there';

  formMessage.textContent = `Thanks, ${name}! Demo signup captured locally only.`;
  signupForm.reset();
});
