/* ---------- Photo lists (edit here when photos are added or removed) ---------- */
// Browsers can't read folders, so every photo is listed here once.
// The home page's random images and the Destinations slideshow both use this list.
const PHOTOS = {
	china: {
		folder: "images/china/",
		items: [
			{ file: "greatwall.jpg", alt: "The Great Wall at Mutianyu winding across wooded hills" },
			{ file: "forbiddencity.jpg", alt: "Halls and courtyard of the Forbidden City in Beijing" },
			{ file: "forbiddencitygate.jpg", alt: "A gate of the Forbidden City" },
			{ file: "temple.jpg", alt: "The Temple of Heaven in Beijing" },
			{ file: "wangfujing.jpg", alt: "Wangfujing shopping street in central Beijing" },
			{ file: "beijinghutongs.jpg", alt: "A traditional hutong lane lined with courtyard homes in Beijing" },
			{ file: "nanjingstreet.jpg", alt: "Shoppers and storefronts on Nanjing Road" },
			{ file: "nanjingstreet2.jpg", alt: "Signs and buildings along Nanjing Road" },
			{ file: "thebund.jpg", alt: "The Bund waterfront with Pudong's skyline across the Huangpu River" },
			{ file: "bailianzx.jpg", alt: "Anime-themed shops and displays inside Bailian ZX Chuangquchang" },
			{ file: "jingantemple.jpg", alt: "The ornate halls of Jing'an Temple in Shanghai" },
			{ file: "yugarden.jpg", alt: "Pavilions and a pond in Yu Garden" },
			{ file: "yugarden2.jpg", alt: "Rockeries and winding paths in Yu Garden" },
			{ file: "yunganggrottoes.jpg", alt: "Carved Buddhist statues in the Yungang Grottoes" },
			{ file: "datongwall.jpg", alt: "The restored ancient city walls of Datong" },
			{ file: "datongwall2.jpg", alt: "Another view of Datong's city walls" },
			{ file: "hangingtemple.jpg", alt: "The Hanging Temple built into a cliff near Mount Heng" },
			{ file: "humbleadministratorsgarden.jpg", alt: "Ponds and pavilions in the Humble Administrator's Garden" },
			{ file: "lingeringgarden.jpg", alt: "Rockeries and covered walkways in Lingering Garden" },
			{ file: "pingjiangroad.jpg", alt: "The canal and traditional buildings along Pingjiang Road" },
			{ file: "suzhou.jpg", alt: "Pingjiang Road in Suzhou" },
			{ file: "suzhou2.jpg", alt: "Another view of Pingjiang Road" },
			{ file: "suzhou3.jpg", alt: "A further view of Pingjiang Road" },
			{ file: "hangzhoumall.jpg", alt: "A shopping area in Hangzhou" },
			{ file: "hangzhoulake.jpg", alt: "West Lake with willow-lined paths and hills beyond" },
			{ file: "hangzhoulake2.jpg", alt: "Another view across West Lake" },
			{ file: "lingyintemple.jpg", alt: "Lingyin Temple's halls beneath wooded hills" },
			{ file: "leifengpagoda.jpg", alt: "Leifeng Pagoda overlooking West Lake" },
			{ file: "hefangstreet.jpg", alt: "Shopfronts and visitors on Hefang Street" },
			{ file: "hangzhoutea.jpg", alt: "Rows of tea bushes on the hills around Longjing village" },
			{ file: "hangzhouwaterfall.jpg", alt: "A waterfall in the Hangzhou hills" },
		],
	},
	taiwan: {
		folder: "images/taiwan/",
		items: [
			{ file: "ximendingdistrict.jpg", alt: "Crowds and bright signs in Taipei's Ximending District" },
			{ file: "chiangkaishek1.jpg", alt: "Chiang Kai-shek Memorial Hall and its grounds in Taipei" },
			{ file: "chiangkaishek2.jpg", alt: "Another view of Chiang Kai-shek Memorial Hall" },
			{ file: "yehilugeopark.jpg", alt: "Sandstone rock formations along the coast at Yehliu Geopark" },
			{ file: "jiufenoldstreet.jpg", alt: "Narrow lanes lined with shops and tea houses on Jiufen Old Street" },
			{ file: "tamsuioldstreet.jpg", alt: "Shops and visitors along Tamsui Old Street" },
			{ file: "shifenoldstreet.jpg", alt: "The railway line running through Shifen Old Street" },
			{ file: "alishan.jpg", alt: "Forested mountain scenery in Alishan" },
			{ file: "xianglinggianttree.jpg", alt: "The Xianglin Giant Tree surrounded by forest in Alishan" },
			{ file: "gianttreecluster.jpg", alt: "A group of massive old-growth trees along the Giant Tree Cluster trail" },
			{ file: "sisterponds.jpg", alt: "The Sister Ponds in Alishan's forest" },
			{ file: "nationalpalacemuseum.jpg", alt: "The National Palace Museum in Taipei" },
			{ file: "shilinnightmarket.jpg", alt: "Crowds and food stalls at Shilin Night Market in Taipei" },
			{ file: "taipei101.jpg", alt: "Taipei 101 skyscraper in Taipei" },
			{ file: "guandutemple.jpg", alt: "Guandu Temple in Taipei" },
		],
	},
};

/* ---------- Modal triggers ---------- */
// Any element with data-open-dialog="<dialog id>" opens that dialog,
// so one dialog in the HTML can be opened from the nav, footer, anywhere.
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

/* ---------- Newsletter signup form (demo) ---------- */
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

/* Fake storage + "server" */
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

/* ---------- Back to top button ---------- */
const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
	const reducedMotionBackToTop = window.matchMedia("(prefers-reduced-motion: reduce)");

	backToTop.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: reducedMotionBackToTop.matches ? "auto" : "smooth" });
	});
}

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

/* ---------- Random photos on the home page ---------- */
// Every <img data-random-image="china"> gets a different photo on each page load.
const randomSlots = document.querySelectorAll('img[data-random-image="china"]');

if (randomSlots.length > 0) {
	const { folder, items } = PHOTOS.china;

	// Shuffle a copy (Fisher-Yates) so no two slots on the page share a photo
	const pool = [...items];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}

	randomSlots.forEach((img, i) => {
		img.src = folder + pool[i % pool.length].file;
	});
}

/* ---------- Slideshows ---------- */
// Any element with class "slideshow" becomes a slideshow. Without JS the
// slides simply show stacked, so the content is never hidden.
//   data-photos="china"  build the slides from that list in PHOTOS
//   data-autoplay        advance automatically (with a Pause button)
//   data-autoplay="hover" advance only while a mouse is over the card
//   data-interval="4000" milliseconds per photo (optional)
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".slideshow").forEach((show) => {
	const controls = show.querySelector(".slideshow-controls");
	const prev = show.querySelector(".slide-prev");
	const next = show.querySelector(".slide-next");
	const count = show.querySelector(".slide-count");
	const toggle = show.querySelector(".slide-toggle");
	if (!controls || !prev || !next) return;

	// Build the slides from a photo list when the slideshow asks for one
	const set = PHOTOS[show.dataset.photos];
	if (set) {
		show.querySelectorAll(".slide").forEach((slide) => slide.remove());
		set.items.forEach((item, i) => {
			const figure = document.createElement("figure");
			figure.className = "slide";
			figure.setAttribute("aria-roledescription", "slide");
			figure.setAttribute("aria-label", `${i + 1} of ${set.items.length}`);

			const img = document.createElement("img");
			img.src = set.folder + item.file;
			img.alt = item.alt;
			img.width = 1200;
			img.height = 675;
			if (i > 0) img.loading = "lazy";

			figure.append(img);
			show.insertBefore(figure, controls);
		});
	}

	const slides = Array.from(show.querySelectorAll(".slide"));
	if (slides.length < 2) return;

	// "off" (manual only), "always" (plays on its own) or "hover" (plays while hovered)
	const autoplayMode = !show.hasAttribute("data-autoplay")
		? "off"
		: show.dataset.autoplay === "hover"
			? "hover"
			: "always";
	const interval = Number(show.dataset.interval) || 4000;
	let current = 0;
	let playing = autoplayMode === "always" && !reducedMotion.matches;
	let hovering = false;
	let focused = false;
	let timer = null;

	function showSlide(index) {
		current = (index + slides.length) % slides.length; // wraps around
		slides.forEach((slide, i) => {
			slide.hidden = i !== current;
		});
		if (count) count.textContent = `${current + 1} / ${slides.length}`;

		// Start loading the next photo so it is ready when the timer fires
		const nextImg = slides[(current + 1) % slides.length].querySelector("img");
		if (nextImg) nextImg.loading = "eager";
	}

	function shouldRun() {
		// Hover mode: only while a mouse is over the card (never for touch or keyboard)
		if (autoplayMode === "hover") return hovering && !reducedMotion.matches;
		// Always mode: unless paused, hovered, or focused
		return playing && !hovering && !focused;
	}

	function refreshTimer() {
		clearInterval(timer);
		timer = null;
		if (shouldRun()) {
			timer = setInterval(() => showSlide(current + 1), interval);
		}
	}

	function updateToggle() {
		if (toggle) {
			toggle.textContent = playing ? "Pause" : "Play";
			toggle.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
		}
		// Don't announce every automatic change to screen readers
		if (count) count.setAttribute("aria-live", playing ? "off" : "polite");
	}

	function go(index) {
		showSlide(index);
		refreshTimer(); // restart the countdown after a manual change
	}

	prev.addEventListener("click", () => go(current - 1));
	next.addEventListener("click", () => go(current + 1));

	// Left/right arrow keys while focus is inside the slideshow
	show.addEventListener("keydown", (event) => {
		if (event.key === "ArrowLeft") go(current - 1);
		if (event.key === "ArrowRight") go(current + 1);
	});

	if (toggle) {
		if (autoplayMode !== "always") {
			toggle.hidden = true; // only needed when the slideshow plays on its own
		} else {
			toggle.addEventListener("click", () => {
				playing = !playing;
				updateToggle();
				refreshTimer();
			});
		}
	}

	// Mouse hover: pauses an "always" slideshow, starts a "hover" one.
	// In hover mode the whole card counts, not just the photo.
	const hoverTarget = autoplayMode === "hover" ? show.closest(".destination-card") || show : show;
	hoverTarget.addEventListener("pointerenter", (event) => {
		if (event.pointerType !== "mouse") return;
		hovering = true;
		refreshTimer();
	});
	hoverTarget.addEventListener("pointerleave", () => {
		hovering = false;
		refreshTimer();
	});

	// Keyboard focus inside the slideshow also pauses an "always" one
	show.addEventListener("focusin", () => {
		focused = true;
		refreshTimer();
	});
	show.addEventListener("focusout", (event) => {
		if (!show.contains(event.relatedTarget)) {
			focused = false;
			refreshTimer();
		}
	});

	showSlide(0);
	updateToggle();
	refreshTimer();
	show.classList.add("is-ready"); // reveals the controls (hidden without JS)
});
