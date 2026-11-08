/**
 * DƯONGBOT AI - WEB FIRMWARE FLASHER & VIEWER
 * Pure Client-side Web Serial Flasher using esptool-js
 */

import { ESPLoader, Transport } from "https://unpkg.com/esptool-js@0.7.1/bundle.js";

// =====================================================================
// 1. CAROUSEL & LIGHTBOX CONTROLLER
// =====================================================================
const SLIDES = [
  {
    src: "Robot_DuongBot_AI_Camera_40P.jpg",
    title: "1/3 • Ảnh Mẫu Robot DươngBot AI Camera 40P",
    desc: "Phiên bản hoàn chỉnh tích hợp Camera AI, Màn hình OLED biểu cảm và điều khiển thông minh.",
    firmwareLabel: "Duongbot-AI-Cam-OV3660-40P"
  },
  {
    src: "So_Do_Noi_Day_DuongBot_3K_NetCang.jpg",
    title: "2/3 • Sơ Đồ Nối Dây Chi Tiết Module & Cảm Biến",
    desc: "Hướng dẫn kết nối chi tiết giữa ESP32-S3, Module Camera, Màn hình, Loa/Mic và Động cơ.",
    firmwareLabel: "Duongbot-AI-Cam-OV3660-40P"
  },
  {
    src: "DUONGBOT_V1_SO_DO_GPIO.jpg",
    title: "3/3 • Bảng Phân Bổ Sơ Đồ Chân GPIO DươngBot V1",
    desc: "Bảng tra cứu chức năng từng chân GPIO trên vi điều khiển ESP32-S3.",
    firmwareLabel: "Duongbot-AI-Cam-OV3660-40P"
  },
  {
    src: "Hinh_Anh_D-BOTAI.jpg",
    title: "4/5 • D-BotAI Dual OLED v1.2",
    desc: "Robot AI màn hình kép, âm thanh trực tuyến và cảm biến ToF.",
    firmwareLabel: "D-BotAI-N16-R8-44P"
  },
  {
    src: "Bang_Chan_GPIO_D-BotAI.jpg",
    title: "5/5 • Sơ Đồ GPIO D-BotAI ESP32-S3-N16-R8-44P",
    desc: "Pinout phần cứng D-BotAI Dual OLED v1.2.",
    firmwareLabel: "D-BotAI-N16-R8-44P"
  }
];

const COMMON_FEATURES = [
  ["🧠", "Trí Tuệ Nhân Tạo (AI)", "Đàm thoại giọng nói hai chiều theo thời gian thực, kết nối máy chủ AI Xiaozhi. Đánh thức tại biên bằng câu lệnh tiếng Việt “Hi Telly” siêu nhạy."],
  ["🎬", "Phát Nhạc YouTube Online", "Tìm và phát nhạc YouTube hoặc SoundCloud theo tên bài hát, ca sĩ bằng giọng nói hoặc Web; truyền luồng âm thanh chất lượng cao, độ trễ thấp."],
  ["📻", "Đài Radio 10 Kênh", "Nghe VOV1, VOV2, VOV3, VOV Giao Thông, Hà Nội, VOH và các kênh Việt Nam khác. HLS media-sequence giúp chuyển kênh mượt, chống lặp tiếng."],
  ["🎵", "Kho Nhạc & Truyện GitHub", "Tuyển chọn Bolero, nhạc trẻ 8x–9x và truyện audio; tự đồng bộ danh sách mới qua Wi-Fi từ GitHub, không cần nạp lại firmware."],
  ["📊", "Phổ Sóng Nhạc (Spectrum)", "Equalizer 16 dải nhảy theo nhạc YouTube/Radio và giọng nói; tự trở về đôi mắt biểu cảm Mochan khi dừng nhạc."]
];

const FIRMWARES = {
  duongbot: {
    name: "DuongBot AI",
    title: "DuongBot AI Camera & OLED",
    board: "ESP32S3-N16-R8-CAM-40P",
    file: "duongbot_cam_oled.bin",
    size: "11.8 MB (Offset 0x0000)",
    camera: "VO3660",
    display: "OLED SSD1306",
    chip: "ESP32-S3 (Xtensa LX7)",
    hardware: "OLED 0.96\" + Camera OV3660",
    description: "Đàm thoại AI Xiaozhi, tìm và phát nhạc YouTube/SoundCloud, nghe 10 kênh radio Việt Nam, đồng bộ kho nhạc/truyện GitHub và hiển thị Spectrum 16 dải cùng đôi mắt Mochan.",
    gallery: 0,
    features: COMMON_FEATURES
  },
  dbotai: {
    name: "D-BotAI",
    title: "D-BotAI Dual OLED (v1.2)",
    board: "ESP32-S3-N16-R8-44P",
    file: "D-BotAI.bin",
    size: "8.81 MB (Offset 0x0000)",
    camera: "VL53L0X ToF",
    display: "Dual OLED",
    chip: "ESP32-S3-N16-R8",
    hardware: "SSD1306 0.96\" + SH1106 1.3\"",
    description: "Đàm thoại AI Xiaozhi, tìm và phát nhạc YouTube/SoundCloud, nghe 10 kênh radio Việt Nam, đồng bộ kho nhạc/truyện GitHub và hiển thị Spectrum 16 dải cùng đôi mắt Mochan.",
    gallery: 3,
    features: COMMON_FEATURES
  }
};

let selectedFirmwareId = "duongbot";

function renderFirmwareFeatures(firmware) {
  const title = document.getElementById("capabilities-title");
  const grid = document.getElementById("capability-grid");
  title.innerHTML = firmware.name === "D-BotAI" ? "D-BotAI <span>Dual OLED · v1.2</span>" : "DuongBot AI <span>Camera & OLED</span>";
  grid.innerHTML = firmware.features.map(([icon, heading, description]) => `
    <article class="capability-item"><span aria-hidden="true">${icon}</span><h3>${heading}</h3><p>${description}</p></article>
  `).join("");
}

function selectFirmware(firmwareId) {
  const firmware = FIRMWARES[firmwareId];
  if (!firmware) return;
  selectedFirmwareId = firmwareId;
  document.querySelectorAll(".firmware-choice").forEach(button => {
    const active = button.dataset.firmwareId === firmwareId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.getElementById("board-badge").textContent = firmware.board;
  document.getElementById("camera-badge").textContent = firmware.camera;
  document.getElementById("display-badge").textContent = firmware.display;
  document.getElementById("product-title").textContent = firmware.title;
  document.getElementById("product-desc").textContent = firmware.description;
  document.getElementById("spec-chip").textContent = firmware.chip;
  document.getElementById("spec-file").textContent = firmware.file;
  document.getElementById("spec-size").textContent = firmware.size;
  document.getElementById("spec-hardware").textContent = firmware.hardware;
  document.getElementById("flash-action-label").textContent = `NẠP ${firmware.name}`;
  renderFirmwareFeatures(firmware);
  document.dispatchEvent(new CustomEvent("firmware-selection-change", { detail: { gallery: firmware.gallery } }));
}

let currentSlideIdx = 0;
let carouselTimer = null;
let isPaused = false;

function initCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const caption = document.getElementById("slide-caption");

  function showSlide(idx) {
    currentSlideIdx = (idx + SLIDES.length) % SLIDES.length;
    
    slides.forEach((s, i) => {
      s.classList.toggle("active", i === currentSlideIdx);
    });

    dots.forEach((d, i) => {
      d.classList.toggle("active", i === currentSlideIdx);
    });

    if (caption) {
      caption.textContent = SLIDES[currentSlideIdx].title;
    }
  }

  // Next / Prev buttons
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  if (prevBtn) prevBtn.addEventListener("click", () => { showSlide(currentSlideIdx - 1); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { showSlide(currentSlideIdx + 1); resetAutoplay(); });

  // Dots
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => { showSlide(idx); resetAutoplay(); });
  });

  // Autoplay (every 4.5 seconds)
  function startAutoplay() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
      if (!isPaused) {
        showSlide(currentSlideIdx + 1);
      }
    }, 4500);
  }

  function resetAutoplay() {
    startAutoplay();
  }

  document.addEventListener("firmware-selection-change", (event) => {
    showSlide(event.detail.gallery);
    resetAutoplay();
  });

  const box = document.getElementById("carousel-box");
  if (box) {
    box.addEventListener("mouseenter", () => isPaused = true);
    box.addEventListener("mouseleave", () => isPaused = false);
    box.addEventListener("touchstart", () => isPaused = true, { passive: true });
    box.addEventListener("touchend", () => setTimeout(() => isPaused = false, 3000), { passive: true });
  }

  startAutoplay();
  showSlide(0);

  // ===================================================================
  // LIGHTBOX PHÓNG TO ẢNH NÉT CĂNG
  // ===================================================================
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCaption = document.getElementById("lightbox-caption");
  const lbFirmwareLabel = document.getElementById("lightbox-firmware-label");
  const zoomBtn = document.getElementById("zoom-btn");
  const viewport = document.getElementById("carousel-viewport");

  function openLightbox(idx) {
    currentSlideIdx = idx;
    lbImg.src = SLIDES[currentSlideIdx].src;
    lbFirmwareLabel.textContent = SLIDES[currentSlideIdx].firmwareLabel;
    lbCaption.textContent = SLIDES[currentSlideIdx].title + " - " + SLIDES[currentSlideIdx].desc;
    lightbox.classList.add("active");
    isPaused = true;
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    isPaused = false;
  }

  if (zoomBtn) {
    zoomBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(currentSlideIdx);
    });
  }

  if (viewport) {
    viewport.addEventListener("click", () => {
      openLightbox(currentSlideIdx);
    });
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.getElementById("lb-prev").addEventListener("click", (e) => {
    e.stopPropagation();
    currentSlideIdx = (currentSlideIdx - 1 + SLIDES.length) % SLIDES.length;
    openLightbox(currentSlideIdx);
  });

  document.getElementById("lb-next").addEventListener("click", (e) => {
    e.stopPropagation();
    currentSlideIdx = (currentSlideIdx + 1) % SLIDES.length;
    openLightbox(currentSlideIdx);
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
    if (lightbox.classList.contains("active")) {
      if (e.key === "ArrowLeft") document.getElementById("lb-prev").click();
      if (e.key === "ArrowRight") document.getElementById("lb-next").click();
    }
  });
}

// =====================================================================
// 2. WEB SERIAL FIRMWARE FLASHER (ESPTOOL-JS)
// =====================================================================
let currentPort = null;
let currentTransport = null;
let isFlashing = false;

async function releaseSerial() {
  if (currentTransport) {
    try { await currentTransport.disconnect(); } catch (e) {}
    if (typeof currentTransport.waitForUnlock === "function") {
      try { await currentTransport.waitForUnlock(1500); } catch (e) {}
    }
    currentTransport = null;
  }
  if (currentPort) {
    try {
      if (currentPort.readable || currentPort.writable) {
        await currentPort.close();
      }
    } catch (e) {
      console.warn("Không thể đóng cổng COM ngay:", e);
    }
  }
  await new Promise(r => setTimeout(r, 250));
}

window.addEventListener("beforeunload", () => {
  if (currentPort && (currentPort.readable || currentPort.writable)) {
    try { currentPort.close(); } catch (e) {}
  }
});

// UI Elements for Flash Modal
const modal = document.getElementById("flash-modal");
const modalIcon = document.getElementById("flash-modal-icon");
const modalTitle = document.getElementById("flash-modal-title");
const modalStatus = document.getElementById("flash-modal-status");
const pFill = document.getElementById("progress-fill");
const pPct = document.getElementById("progress-pct");
const pBytes = document.getElementById("progress-bytes");
const terminal = document.getElementById("terminal-logs");
const closeBtn = document.getElementById("modal-close-btn");

function logToTerminal(msg, type = "info") {
  const line = document.createElement("div");
  if (type === "err") line.className = "log-err";
  else if (type === "ok") line.className = "log-ok";
  else line.className = "log-info";
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

function openFlashModal(title, status) {
  modalTitle.textContent = title;
  modalStatus.textContent = status;
  pFill.style.width = "0%";
  pPct.textContent = "0%";
  pBytes.textContent = "0 / 0 bytes";
  terminal.innerHTML = "";
  modalIcon.className = "flash-modal-icon";
  modalIcon.innerHTML = "⚡";
  closeBtn.style.display = "none";
  modal.classList.add("active");
}

function finishFlashModal(success, title, msg) {
  isFlashing = false;
  modalTitle.textContent = title;
  modalStatus.textContent = msg;
  closeBtn.style.display = "block";
  if (success) {
    modalIcon.className = "flash-modal-icon success";
    modalIcon.innerHTML = "✔";
    pFill.style.width = "100%";
    pPct.textContent = "100%";
  } else {
    modalIcon.className = "flash-modal-icon error";
    modalIcon.innerHTML = "✕";
  }
}

async function startFirmwareFlash(customFile = null) {
  if (!("serial" in navigator)) {
    alert("Trình duyệt này không hỗ trợ Web Serial API!\nVui lòng sử dụng Google Chrome, Microsoft Edge hoặc Cốc Cốc trên máy tính.");
    return;
  }

  let fileBuffer = null;
  const firmware = FIRMWARES[selectedFirmwareId];
  let fileName = firmware.file;

  try {
    if (customFile) {
      fileName = customFile.name;
      logToTerminal(`📁 Đang đọc file từ máy tính: ${fileName}...`);
      fileBuffer = await customFile.arrayBuffer();
    } else {
      openFlashModal("Đang tải dữ liệu...", `Đang tải firmware ${firmware.name} từ máy chủ...`);
      logToTerminal(`🌐 Đang tải firmware ${firmware.name} (${fileName}) từ máy chủ...`);
      const response = await fetch(`${fileName}?v=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Không thể tải firmware từ máy chủ (${response.status} ${response.statusText})`);
      }
      fileBuffer = await response.arrayBuffer();
      logToTerminal(`✔ Đã nạp dữ liệu firmware vào bộ nhớ (${(fileBuffer.byteLength / (1024 * 1024)).toFixed(2)} MB).`, "ok");
    }
  } catch (err) {
    alert("Lỗi tải tệp firmware: " + err.message);
    modal.classList.remove("active");
    return;
  }

  // Request COM Port
  let port;
  try {
    modalStatus.textContent = "Vui lòng chọn cổng COM của thiết bị trong cửa sổ hiện ra...";
    logToTerminal("🔌 Đang mở hộp thoại chọn cổng COM...", "info");
    port = await navigator.serial.requestPort();
  } catch (err) {
    console.log("Người dùng huỷ chọn cổng COM:", err);
    modal.classList.remove("active");
    return;
  }

  isFlashing = true;
  await releaseSerial();
  currentPort = port;

  openFlashModal("Đang kết nối vi điều khiển...", "Đang đồng bộ với ESP32-S3...");
  logToTerminal("✔ Cổng COM đã chọn thành công.", "ok");

  const baudrateSelect = document.getElementById("flash-baudrate");
  const baudRate = parseInt(baudrateSelect ? baudrateSelect.value : "460800", 10);

  try {
    const transport = new Transport(port, true);
    currentTransport = transport;

    const esploader = new ESPLoader({
      transport,
      baudrate: baudRate,
      terminal: {
        clean() {
          if (terminal) terminal.innerHTML = "";
        },
        write(m) {
          if (m && m.trim()) logToTerminal(m.trim(), "info");
        },
        writeLine(m) {
          if (m && m.trim()) logToTerminal(m.trim(), "info");
        }
      }
    });

    logToTerminal(`🔄 Đang bắt tay và kết nối ở tốc độ ${baudRate} bps...`);
    modalStatus.textContent = "Đang nhận diện vi điều khiển...";

    const chipName = await esploader.main();
    logToTerminal(`✔ Đã phát hiện vi điều khiển: ${chipName}`, "ok");
    if (!/esp32[\s-]*s3/i.test(chipName)) {
      throw new Error(`Đã phát hiện ${chipName}; hai firmware này chỉ dành cho ESP32-S3.`);
    }
    modalTitle.textContent = `Bắt đầu nạp (${chipName})`;
    modalStatus.textContent = "Đang xoá vùng nhớ và ghi dữ liệu, vui lòng không rút cáp!";

    // Pass the merged firmware image as bytes at its 0x0000 flash offset.
    const bytes = new Uint8Array(fileBuffer);
    if (bytes.length === 0 || bytes[0] !== 0xe9) {
      throw new Error("File không có header image ESP hợp lệ (byte đầu phải là E9).");
    }
    if (bytes.byteLength > 16 * 1024 * 1024) {
      throw new Error("File firmware vượt dung lượng flash 16 MB của bo mạch.");
    }

    const fileArray = [{ data: bytes, address: 0x0000 }];

    logToTerminal(`⚡ Bắt đầu ghi ${fileArray.length} tệp vào địa chỉ 0x0000...`, "ok");

    await esploader.writeFlash({
      fileArray: fileArray,
      flashMode: "keep",
      flashFreq: "keep",
      flashSize: "keep",
      eraseAll: false,
      compress: true,
      reportProgress(fileIdx, written, total) {
        const pct = Math.round((written / total) * 100);
        pFill.style.width = pct + "%";
        pPct.textContent = pct + "%";
        pBytes.textContent = `${(written / 1024).toFixed(0)} KB / ${(total / 1024).toFixed(0)} KB`;
        modalStatus.textContent = `Đang nạp: ${pct}% - Vui lòng không ngắt kết nối`;
      }
    });

    logToTerminal("✔ Nạp xong toàn bộ dữ liệu!", "ok");
    modalStatus.textContent = "Đang khởi động lại vi điều khiển (Hard Reset)...";
    logToTerminal("🔄 Đang gửi tín hiệu Reset chip...");

    await esploader.after("hard_reset");
    logToTerminal("✔ Vi điều khiển đã khởi động lại thành công!", "ok");

    finishFlashModal(true, "Nạp Firmware Thành Công! 🎉", `${firmware.name} đã sẵn sàng hoạt động. Bạn có thể mở Serial Monitor bên dưới để kiểm tra log.`);
  } catch (err) {
    console.error("Lỗi khi nạp:", err);
    logToTerminal(`❌ Lỗi: ${err.message}`, "err");
    finishFlashModal(false, "Nạp Thất Bại ❌", "Có lỗi xảy ra: " + err.message + ". Vui lòng thử lại hoặc bấm giữ nút BOOT khi nạp.");
  } finally {
    await releaseSerial();
  }
}

// =====================================================================
// 3. SERIAL MONITOR / CONSOLE DEBUG
// =====================================================================
let monPort = null;
let monReader = null;
let monKeepReading = false;

async function toggleSerialMonitor() {
  const btn = document.getElementById("mon-toggle-btn");
  const monTerm = document.getElementById("mon-terminal");

  if (monKeepReading) {
    // Disconnect
    monKeepReading = false;
    if (monReader) {
      try { await monReader.cancel(); } catch (e) {}
    }
    if (monPort) {
      try { await monPort.close(); } catch (e) {}
      monPort = null;
    }
    btn.textContent = "🔌 Mở Cổng Serial";
    btn.className = "btn-secondary";
    monTerm.textContent += "\n--- Đã ngắt kết nối Serial ---\n";
    return;
  }

  if (!("serial" in navigator)) {
    alert("Trình duyệt không hỗ trợ Web Serial!");
    return;
  }

  try {
    monPort = await navigator.serial.requestPort();
    await monPort.open({ baudRate: 115200 });

    monKeepReading = true;
    btn.textContent = "🔴 Đóng Cổng Serial";
    btn.className = "btn-secondary";
    btn.style.color = "#EF4444";
    monTerm.textContent += "\n--- Đã kết nối Serial (115200 bps) ---\n";

    const textDecoder = new TextDecoderStream();
    monPort.readable.pipeTo(textDecoder.writable);
    monReader = textDecoder.readable.getReader();

    while (monKeepReading) {
      const { value, done } = await monReader.read();
      if (done) break;
      if (value) {
        monTerm.textContent += value;
        monTerm.scrollTop = monTerm.scrollHeight;
      }
    }
  } catch (err) {
    console.error("Serial Monitor Error:", err);
    monTerm.textContent += `\nLỗi Serial: ${err.message}\n`;
    monKeepReading = false;
    btn.textContent = "🔌 Mở Cổng Serial";
    btn.style.color = "";
  }
}

// =====================================================================
// 4. INITIALIZATION ON DOM READY
// =====================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Check Web Serial support
  const alertBox = document.getElementById("browser-alert");
  if (!("serial" in navigator)) {
    if (alertBox) {
      alertBox.className = "browser-alert unsupported";
      alertBox.innerHTML = `
        <span class="alert-icon">⚠️</span>
        <div>Trình duyệt hiện tại chưa hỗ trợ Web Serial API. Vui lòng mở trang web này bằng <b>Google Chrome</b>, <b>Microsoft Edge</b> hoặc <b>Cốc Cốc</b> trên máy tính để nạp firmware trực tiếp!</div>
      `;
    }
  }

  // Initialize Carousel & Lightbox
  document.querySelectorAll(".firmware-choice").forEach(button => {
    button.addEventListener("click", () => selectFirmware(button.dataset.firmwareId));
  });
  selectFirmware(selectedFirmwareId);
  initCarousel();

  // Primary Flash Button
  const flashBtn = document.getElementById("btn-flash-primary");
  if (flashBtn) {
    flashBtn.addEventListener("click", () => {
      startFirmwareFlash(null);
    });
  }

  // Custom Local File Flash
  const customFileInput = document.getElementById("custom-bin-file");
  if (customFileInput) {
    customFileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        if (confirm(`Bạn có chắc chắn muốn nạp file '${e.target.files[0].name}' thay cho bản mặc định không?`)) {
          startFirmwareFlash(e.target.files[0]);
        }
      }
    });
  }

  // Close modal button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  // Serial Monitor Toggle & Clear
  const monBtn = document.getElementById("mon-toggle-btn");
  if (monBtn) monBtn.addEventListener("click", toggleSerialMonitor);

  const monClearBtn = document.getElementById("mon-clear-btn");
  if (monClearBtn) {
    monClearBtn.addEventListener("click", () => {
      document.getElementById("mon-terminal").textContent = "";
    });
  }
});
