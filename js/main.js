/* The Hot Sit - shared behaviour */
(function () {
  var C = window.HOTSIT;
  var page = document.body.getAttribute("data-page") || "home";

  /* ---------- Header / Footer / WhatsApp ---------- */
  var links = [
    ["home", "index.html", "Home"],
    ["about", "about.html", "About Us"],
    ["services", "services.html", "Services"],
    ["gallery", "gallery.html", "Gallery"],
    ["contact", "contact.html", "Contact"]
  ];
  var nav = links.map(function (l) {
    return '<a href="' + l[1] + '"' + (l[0] === page ? ' class="active"' : "") + ">" + l[2] + "</a>";
  }).join("");

  var header =
    '<header class="site-header"><div class="container nav">' +
    '<a href="index.html" class="logo" aria-label="The Hot Sit home"><span class="mark">&#10022;</span>The <b>Hot Sit</b></a>' +
    '<button class="burger" aria-label="Toggle menu" aria-expanded="false"><span></span></button>' +
    '<nav class="nav-links" id="navlinks">' + nav +
    '<a href="contact.html#book" class="btn btn-pink">Book Now</a></nav></div></header>';

  var footer =
    '<footer class="site-footer"><div class="container foot-grid">' +
    '<div><a href="index.html" class="logo" style="color:#fff"><span class="mark">&#10022;</span>The <b>Hot Sit</b></a>' +
    '<p style="margin-top:14px;max-width:320px">Where glamour meets elegance. Hair, nails and make-up crafted to make you feel unforgettable.</p></div>' +
    '<div><h4>Explore</h4><ul>' + links.map(function (l) { return '<li><a href="' + l[1] + '">' + l[2] + "</a></li>"; }).join("") + "</ul></div>" +
    '<div><h4>Visit &amp; Contact</h4><ul>' +
    "<li>&#128205; " + C.location + "</li>" +
    '<li>&#128222; <a href="tel:' + C.phoneTel + '">' + C.phoneDisplay + "</a></li>" +
    '<li>&#9993; <a href="mailto:' + C.email + '">' + C.email + "</a></li></ul></div></div>" +
    '<div class="foot-bottom">&copy; ' + new Date().getFullYear() + " The Hot Sit. All rights reserved.</div></footer>";

  var wa =
    '<a class="wa-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" href="https://wa.me/' +
    C.whatsappNumber + "?text=" + encodeURIComponent(C.whatsappMessage) + '">' +
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.38 4 15.01c0 2.12.55 4.19 1.6 6.01L4 28l7.17-1.88a12.03 12.03 0 0 0 4.87 1.02h.01c6.63 0 12.03-5.39 12.03-12.02C28.08 8.38 22.68 3 16.04 3zm0 21.94h-.01a9.97 9.97 0 0 1-5.08-1.39l-.36-.22-4.25 1.11 1.13-4.14-.24-.38a9.9 9.9 0 0 1-1.52-5.3c0-5.5 4.49-9.97 10.02-9.97 5.52 0 10.01 4.47 10.01 9.97 0 5.5-4.49 9.97-10 9.97zm5.49-7.46c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35z"/></svg></a>';

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer + wa);

  var burger = document.querySelector(".burger");
  var menu = document.getElementById("navlinks");
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("open"); burger.classList.remove("open"); }
  });

  /* ---------- Scroll reveal ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });

  /* ---------- Count-up numbers ---------- */
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10), suffix = el.getAttribute("data-suffix") || "";
    var done = false;
    function run() {
      if (done) return; done = true;
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1400, 1);
        el.textContent = Math.floor(p * target) + suffix;
        if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { run(); o.disconnect(); } }).observe(el);
    } else run();
  });

  /* ---------- Data loading (Google Sheet with fallback) ---------- */
  function loadData(kind) {
    var fallback = C[kind];
    if (!C.scriptUrl) return Promise.resolve(fallback);
    return fetch(C.scriptUrl + "?action=" + kind)
      .then(function (r) { return r.json(); })
      .then(function (d) { return d && d.length ? d : fallback; })
      .catch(function () { return fallback; });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function safeUrl(u) { return /^https?:\/\//i.test(u) ? u : ""; }

  /* ---------- Services ---------- */
  var svc = document.getElementById("services-list");
  if (svc) {
    var icons = { "Hair": "&#9986;", "Nails": "&#10084;", "Make-Up": "&#10024;" };
    var titles = { "Hair": "Hair", "Nails": "Nails", "Make-Up": "Make-Up" };
    loadData("services").then(function (items) {
      var cats = [];
      items.forEach(function (i) { if (cats.indexOf(i.category) < 0) cats.push(i.category); });
      svc.innerHTML = cats.map(function (c) {
        var list = items.filter(function (i) { return i.category === c; }).map(function (i) {
          return '<div class="price-item"><h4>' + esc(i.name) + '</h4><div class="price">' + esc(i.price) + "</div></div>";
        }).join("");
        return '<div class="service-block reveal"><h2><span class="ic">' + (icons[c] || "&#10022;") + "</span>" +
          esc(titles[c] || c) + '</h2><div class="price-list">' + list + "</div></div>";
      }).join("");
      svc.querySelectorAll(".reveal").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });
    });
  }

  /* ---------- Home: featured categories + preview ---------- */

  /* ---------- Gallery ---------- */
  var gal = document.getElementById("gallery");
  if (gal) {
    var gradients = ["var(--grad-pink)", "var(--grad-gold)"];
    var gicons = { "Hair": "&#9986;", "Nails": "&#10084;", "Make-Up": "&#10024;" };
    var items = [];
    var filtersEl = document.getElementById("filters");
    var lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img");

    function render(cat) {
      var shown = items.filter(function (i) { return cat === "All" || i.category === cat; });
      gal.innerHTML = shown.map(function (i, n) {
        var url = safeUrl(i.url);
        var inner = url
          ? '<img loading="lazy" src="' + esc(url) + '" alt="' + esc(i.title) + '">'
          : '<div class="g-ph" style="background:' + gradients[n % 2] + '">' + (gicons[i.category] || "&#10022;") + "</div>";
        return '<div class="g-item" data-url="' + esc(url) + '" data-title="' + esc(i.title) + '">' + inner +
          '<div class="cap">' + esc(i.title) + " &middot; " + esc(i.category) + "</div></div>";
      }).join("");
    }
    loadData("gallery").then(function (data) {
      items = data;
      var cats = ["All"];
      items.forEach(function (i) { if (cats.indexOf(i.category) < 0) cats.push(i.category); });
      filtersEl.innerHTML = cats.map(function (c, n) {
        return '<button class="filter' + (n === 0 ? " active" : "") + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
      }).join("");
      render("All");
    });
    filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest(".filter"); if (!b) return;
      filtersEl.querySelectorAll(".filter").forEach(function (f) { f.classList.remove("active"); });
      b.classList.add("active"); render(b.getAttribute("data-cat"));
    });
    gal.addEventListener("click", function (e) {
      var it = e.target.closest(".g-item");
      if (!it || !it.getAttribute("data-url")) return;
      lbImg.src = it.getAttribute("data-url"); lbImg.alt = it.getAttribute("data-title");
      lb.classList.add("show");
    });
    lb.addEventListener("click", function () { lb.classList.remove("show"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("show"); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var sel = document.getElementById("service");
    C.services.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s.category + " - " + s.name; o.textContent = s.category + " - " + s.name;
      sel.appendChild(o);
    });
    var msg = document.getElementById("form-msg");
    var btn = form.querySelector("button[type=submit]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.className = "form-msg";
      if (form.elements["website"].value) return; // honeypot
      var name = form.elements["name"].value.trim(), email = form.elements["email"].value.trim(), phone = form.elements["phone"].value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, "").length < 9) {
        msg.className = "form-msg err"; msg.textContent = "Please enter your name, a valid email and a valid phone number.";
        return;
      }
      var data = {
        name: name, email: email, phone: phone,
        service: form.elements["service"].value, date: form.elements["date"].value, message: form.elements["message"].value.trim()
      };
      var okText = "Thank you, " + name.split(" ")[0] + "! Your request has been received. A confirmation email is on its way to " + email +
        ", and our team will contact you shortly to confirm your booking.";

      if (!C.scriptUrl) {
        msg.className = "form-msg err";
        msg.textContent = "The form is not connected to Google Sheets yet. Please set scriptUrl in js/config.js (see README), or WhatsApp us directly.";
        return;
      }
      btn.disabled = true; btn.textContent = "Sending...";
      fetch(C.scriptUrl, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      }).then(function () {
        msg.className = "form-msg ok"; msg.textContent = okText; form.reset();
      }).catch(function () {
        msg.className = "form-msg err";
        msg.textContent = "Something went wrong sending your message. Please try again or WhatsApp us on " + C.phoneDisplay + ".";
      }).then(function () { btn.disabled = false; btn.textContent = "Send Message"; });
    });
  }
})();
