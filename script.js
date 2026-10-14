/* ============================================================
   Left 4 Dev — Interactive Showcase
   Thành viên 3 · Phạm Thành Danh
   Scroll Reveal (AOS), Accessibility & Mobile Optimizer
   ============================================================ */

/* ---------- DOM references ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

/* ---------- Accessibility: reduced-motion ---------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Mobile menu — open / close ---------- */
function setMenuOpen(isOpen) {
	menuToggle?.setAttribute('aria-expanded', String(isOpen));
	menuToggle?.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
	siteNav?.classList.toggle('is-open', isOpen);

	/* Khi mở menu, đặt focus vào link đầu tiên để hỗ trợ bàn phím */
	if (isOpen) {
		const firstLink = siteNav?.querySelector('a');
		firstLink?.focus();
	}
}

/* Nút hamburger toggle */
menuToggle?.addEventListener('click', () => {
	const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
	setMenuOpen(!isOpen);
});

/* ---------- Dropdown menu chọn thành viên ---------- */
const navDropdown = document.querySelector('.nav-dropdown');
const dropdownTrigger = document.querySelector('.dropdown-trigger');

function setDropdownOpen(isOpen) {
	navDropdown?.classList.toggle('is-open', isOpen);
	dropdownTrigger?.setAttribute('aria-expanded', String(isOpen));
}

dropdownTrigger?.addEventListener('click', (e) => {
	e.stopPropagation();
	const isOpen = navDropdown?.classList.contains('is-open');
	setDropdownOpen(!isOpen);
});

/* Đóng menu khi click vào bất kỳ link nào trong nav */
siteNav?.querySelectorAll('a').forEach((link) => {
	link.addEventListener('click', () => {
		setMenuOpen(false);
		setDropdownOpen(false);
	});
});

/* Đóng menu và dropdown khi nhấn Escape */
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		const isNavOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
		if (isNavOpen) {
			setMenuOpen(false);
			menuToggle?.focus();
		}
		if (navDropdown?.classList.contains('is-open')) {
			setDropdownOpen(false);
			dropdownTrigger?.focus();
		}
	}
});

/* Đóng menu và dropdown khi click ra ngoài */
document.addEventListener('click', (event) => {
	const isNavOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
	const header = document.querySelector('.site-header');

	if (isNavOpen && header && !header.contains(event.target)) {
		setMenuOpen(false);
	}

	if (navDropdown?.classList.contains('is-open') && !navDropdown.contains(event.target)) {
		setDropdownOpen(false);
	}
});

/* ---------- Project detail toggle ---------- */
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

/* ---------- AOS: Scroll Revelation ---------- */
/**
 * AOS được gắn bằng <script defer> nên sẽ sẵn sàng khi DOMContentLoaded
 * hoặc ở thời điểm script.js chạy. Để an toàn, ta kiểm tra cả hai
 * trường hợp: (a) AOS đã tải, (b) AOS chưa tải → đợi window load.
 */
function initAOS() {
	if (typeof AOS === 'undefined') return;

	AOS.init({
		duration: prefersReducedMotion ? 0 : 650,
		easing: 'ease-out-quart',
		once: true,
		offset: 80,
		disable: prefersReducedMotion
	});

	document.body.classList.add('aos-ready');
}

/* Thử khởi tạo ngay — nếu AOS đã load xong */
if (typeof AOS !== 'undefined') {
	initAOS();
} else {
	/* Nếu AOS chưa sẵn sàng (CDN chậm), đợi window load */
	window.addEventListener('load', initAOS);
}
