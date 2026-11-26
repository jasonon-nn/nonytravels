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