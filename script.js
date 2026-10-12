const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

function setMenuOpen(isOpen) {
	menuToggle?.setAttribute('aria-expanded', String(isOpen));
	menuToggle?.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
	siteNav?.classList.toggle('is-open', isOpen);
}

menuToggle?.addEventListener('click', () => {
	const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
	setMenuOpen(!isOpen);
});

siteNav?.querySelectorAll('a').forEach((link) => {
	link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') setMenuOpen(false);
});

document.querySelectorAll('.detail-toggle').forEach((button) => {
	const detail = button.closest('.project-info')?.querySelector('.project-detail');
	if (!detail) return;

	button.addEventListener('click', () => {
		const isOpen = button.getAttribute('aria-expanded') === 'true';
		button.setAttribute('aria-expanded', String(!isOpen));
		button.setAttribute('aria-label', isOpen ? button.getAttribute('aria-label').replace('Ẩn chi tiết', 'Xem chi tiết') : button.getAttribute('aria-label').replace('Xem chi tiết', 'Ẩn chi tiết'));
		detail.hidden = isOpen;
	});
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.AOS) {
	AOS.init({
		duration: prefersReducedMotion ? 0 : 650,
		easing: 'ease-out-quart',
		once: true,
		offset: 80,
		disable: prefersReducedMotion
	});
	document.body.classList.add('aos-ready');
}
