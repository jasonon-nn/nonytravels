/* Modal triggers  */
document.querySelectorAll("[data-open-dialog]").forEach((trigger) => {
	const target = document.getElementById(trigger.dataset.openDialog);
	if (!target) return;

	trigger.addEventListener("click", () => {
		target.showModal(); // focus returns to whichever trigger opened it
	});
});

// Clear leftover messages whenever a dialog with a newsletter form closes
document.querySelectorAll("dialog").forEach((dlg) => {
	dlg.addEventListener("close", () => {
		const form = dlg.querySelector("form[data-newsletter-form]");
		if (form) clearAllMessages(form);
	});
});

/* Newsletter signup form (demo) */
const STORAGE_KEY = "demo-newsletter-subscribers";
const FAKE_NETWORK_DELAY = 900; // ms, makes the demo feel like a real request

/* Messages */
function setFieldError(form, field, message) {
	const errorEl = form.querySelector(`[data-error-for="${field}"]`);
	if (errorEl) errorEl.textContent = message;

	const control = form.querySelector(`[name="${field}"]`);
	if (control && (control.type === "text" || control.type === "email")) {
		if (message) control.setAttribute("aria-invalid", "true");
		else control.removeAttribute("aria-invalid");
	}
}

function setStatus(form, message, type) {
	const status = form.querySelector(".form-status");
	if (!status) return;
	status.textContent = message;
	status.dataset.state = type; // "success" | "error" | "" (used by CSS)
}

function clearAllMessages(form) {
	form.querySelectorAll("[data-error-for]").forEach((el) => {
		setFieldError(form, el.dataset.errorFor, "");
	});
	setStatus(form, "", "");
}

/* Validation */
function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function validate(form) {
	const data = new FormData(form);
	const errors = {};

	const name = (data.get("name") || "").trim();
	if (name.length < 2) {
		errors.name = "Please enter your full name.";
	}

	const email = (data.get("email") || "").trim();
	if (!email) {
		errors.email = "Please enter your email address.";
	} else if (!isValidEmail(email)) {
		errors.email = "Please enter a valid email address.";
	}

	if (data.getAll("interests").length === 0) {
		errors.interests = "Choose at least one topic.";
	}

	if (!data.get("frequency")) {
		errors.frequency = "Choose how often you'd like to hear from us.";
	}

	if (!data.get("consent")) {
		errors.consent = "You must agree to receive the newsletter to subscribe.";
	}

	return errors;
}

/* Fake "server" */
function loadSubscribers() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
	} catch {
		return {};
	}
}

function saveSubscribers(subscribers) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
	} catch {
		/* storage unavailable (private mode etc.), demo still works */
	}
}

function fakeSubscribeRequest(subscriber) {
	return new Promise((resolve) => {
		setTimeout(() => {
			const subscribers = loadSubscribers();
			const key = subscriber.email.toLowerCase();

			if (subscribers[key]) {
				resolve({ ok: false, reason: "duplicate" });
				return;
			}

			subscribers[key] = { ...subscriber, subscribedAt: new Date().toISOString() };
			saveSubscribers(subscribers);
			resolve({ ok: true });
		}, FAKE_NETWORK_DELAY);
	});
}

/* Form wiring */
document.querySelectorAll("form[data-newsletter-form]").forEach((form) => {
	const button = form.querySelector('button[type="submit"]');
	const buttonLabel = button.textContent;

	// Clear a field's error as soon as the visitor changes it
	form.addEventListener("input", (event) => {
		if (event.target.name) setFieldError(form, event.target.name, "");
		setStatus(form, "", "");
	});

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		clearAllMessages(form);

		const errors = validate(form);
		const fields = Object.keys(errors);

		if (fields.length > 0) {
			fields.forEach((field) => setFieldError(form, field, errors[field]));
			form.querySelector(`[name="${fields[0]}"]`).focus();
			return;
		}

		const data = new FormData(form);
		const subscriber = {
			name: data.get("name").trim(),
			email: data.get("email").trim(),
			interests: data.getAll("interests"),
			frequency: data.get("frequency"),
			consent: true,
		};

		// Loading state
		button.disabled = true;
		button.textContent = "Subscribing…";

		const result = await fakeSubscribeRequest(subscriber);

		button.disabled = false;
		button.textContent = buttonLabel;

		if (!result.ok) {
			setFieldError(form, "email", "That email is already subscribed.");
			form.querySelector('[name="email"]').focus();
			return;
		}

		form.reset();
		const firstName = subscriber.name.split(/\s+/)[0];
		setStatus(form, `Thanks, ${firstName}! Check your inbox to confirm your subscription.`, "success");

		// If the form lives in a modal, close it after a moment
		const parentDialog = form.closest("dialog");
		if (parentDialog) {
			setTimeout(() => parentDialog.close(), 2500);
		}
	});
});

/* Back to top button */
const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
	const SHOW_AFTER = 400; // px scrolled before the button appears
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

	function updateBackToTop() {
		backToTop.classList.toggle("is-visible", window.scrollY > SHOW_AFTER);
	}

	window.addEventListener("scroll", updateBackToTop, { passive: true });
	updateBackToTop();

	backToTop.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
	});
}

/* Slideshows */
// Any element with class "slideshow" becomes a slideshow. Without JS,
// all slides simply show stacked, so the content is never hidden.
document.querySelectorAll(".slideshow").forEach((show) => {
	const slides = Array.from(show.querySelectorAll(".slide"));
	const prev = show.querySelector(".slide-prev");
	const next = show.querySelector(".slide-next");
	const count = show.querySelector(".slide-count");
	if (slides.length < 2) return;

	let current = 0;

	function showSlide(index) {
		current = (index + slides.length) % slides.length; // wraps around
		slides.forEach((slide, i) => {
			slide.hidden = i !== current;
		});
		if (count) count.textContent = `${current + 1} / ${slides.length}`;
	}

	prev.addEventListener("click", () => showSlide(current - 1));
	next.addEventListener("click", () => showSlide(current + 1));

	// Left/right arrow keys while focus is inside the slideshow
	show.addEventListener("keydown", (event) => {
		if (event.key === "ArrowLeft") showSlide(current - 1);
		if (event.key === "ArrowRight") showSlide(current + 1);
	});

	showSlide(0);
});

/* Page sidebar: built automatically from the headings in .page-content */
const pageNav = document.querySelector(".page-nav");
const pageContent = document.querySelector(".page-content");

if (pageNav && pageContent) {
	const target = pageNav.querySelector("nav");
	const headings = pageContent.querySelectorAll("h2, h3.city-heading, h4.city-subheading");
	const usedIds = new Set(Array.from(document.querySelectorAll("[id]"), (el) => el.id));

	// "Jing'an Temple" -> "jing-an-temple" (adds -2, -3... if a name repeats)
	function makeId(text) {
		const base = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
		let id = base;
		let n = 2;
		while (usedIds.has(id)) id = `${base}-${n++}`;
		usedIds.add(id);
		return id;
	}

	if (target && headings.length > 0) {
		const list = document.createElement("ul");
		let lastTopItem = null;

		headings.forEach((heading) => {
			const label = heading.textContent.trim();
			if (!heading.id) heading.id = makeId(label);

			const link = document.createElement("a");
			link.href = `#${heading.id}`;
			link.textContent = label;

			const item = document.createElement("li");
			item.append(link);

			if (heading.tagName === "H4" && lastTopItem) {
				// Attractions nest under their city
				let sub = lastTopItem.querySelector("ul");
				if (!sub) {
					sub = document.createElement("ul");
					lastTopItem.append(sub);
				}
				sub.append(item);
			} else {
				list.append(item);
				lastTopItem = item;
			}
		});

		target.append(list);
		pageNav.classList.add("is-ready");

		// Open on desktop, collapsed on phones (the visitor can still toggle it)
		const desktop = window.matchMedia("(min-width: 801px)");
		const syncOpen = () => {
			pageNav.open = desktop.matches;
		};
		syncOpen();
		desktop.addEventListener("change", syncOpen);
	}
}

