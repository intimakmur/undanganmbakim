document.body.style.overflow = "hidden";

const openBtn = document.querySelector(".btn-open");
const cover = document.getElementById("cover-wrapper");
const invitation = document.getElementById("invitation");
const audio = document.getElementById("bg-music");
  
/* === TAMBAHAN GONG === */
const gong = document.getElementById("gong-sound");

openBtn.addEventListener("click", () => {

  /* MAIN GONG SEKALI */
  if(gong){
    gong.currentTime = 0;
    gong.volume = 0.4;
    gong.play().catch(()=>{});
  }

  cover.classList.add("open");

  if(audio){
    audio.volume = 0.6;
    audio.play().catch(()=>{});
  }

  setTimeout(() => {
    cover.style.display = "none";
    invitation.classList.add("show");
    document.body.style.overflow = "auto";  
  }, 1300);
});

/* ================= FADE UP ================= */
const fades = document.querySelectorAll(".fade-up");
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
      obs.unobserve(e.target);
    }
  });
},{threshold:.2});

fades.forEach(el=>obs.observe(el));

/* ================= PREWED SLIDER ================= */
const sliderTrack = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slider-slide");
const prevBtn = document.querySelector(".slider-prev");
const nextBtn = document.querySelector(".slider-next");
const dotsContainer = document.querySelector(".slider-dots");
const total = slides.length;
let current = 0;

function goToSlide(i) {
  current = (i + total) % total;
  if (sliderTrack) sliderTrack.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll(".slider-dots .dot").forEach((d, j) => d.classList.toggle("active", j === current));
}

if (total > 0 && dotsContainer) {
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}
if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(current - 1));
if (nextBtn) nextBtn.addEventListener("click", () => goToSlide(current + 1));

/* ================= UCAPAN & DOA FORM ================= */
const formUcapan = document.querySelector(".form-ucapan");
const ucapanMsg = document.getElementById("ucapan-msg");
const ucapanList = document.getElementById("ucapan-list");

if (formUcapan && ucapanMsg && ucapanList) {
  formUcapan.addEventListener("submit", async (e) => {
    e.preventDefault();

    const namaField = formUcapan.elements.namedItem("nama");
    const ucapanField = formUcapan.elements.namedItem("ucapan");
    const namaValue = namaField && "value" in namaField ? namaField.value.trim() : "";
    const ucapanValue = ucapanField && "value" in ucapanField ? ucapanField.value.trim() : "";

    const nama = namaValue || "Tamu";
    const ucapan = ucapanValue;
    if (!ucapan) return;

    // Tambah langsung ke daftar di bawah form
    const item = document.createElement("div");
    item.className = "ucapan-item";
    item.innerHTML = '<p class="ucapan-nama">' + nama + '</p><p class="ucapan-teks">' + ucapan.replace(/\n/g,"<br>") + "</p>";
    ucapanList.prepend(item);

    ucapanMsg.textContent = "Terima kasih, ucapan dan doa Anda telah tercatat.";
    ucapanMsg.className = "form-ucapan-msg success";
    formUcapan.reset();

    // Opsional: tetap kirim ke Formspree jika YOUR_FORM_ID sudah diganti
    const action = formUcapan.getAttribute("action") || "";
    if (!action.includes("YOUR_FORM_ID")) {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("ucapan", ucapan);
      try {
        await fetch(action, { method: "POST", body: formData, headers: { Accept: "application/json" } });
      } catch (err) {
        // diamkan saja; tampilan lokal sudah berhasil
      }
    }
  });
}

/* ================= GIFT COPY ================= */
const giftCards = document.querySelectorAll(".gift-card");
giftCards.forEach(card => {
  const btn = card.querySelector(".gift-copy-btn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const rek = card.getAttribute("data-rek");
    if (!rek) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(rek);
      } else {
        const temp = document.createElement("textarea");
        temp.value = rek;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      btn.textContent = "Tersalin";
      setTimeout(() => { btn.textContent = "Salin nomor"; }, 2000);
    } catch (e) {
      btn.textContent = "Gagal menyalin";
      setTimeout(() => { btn.textContent = "Salin nomor"; }, 2000);
    }
  });
});
