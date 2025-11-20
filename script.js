    // Güçlü, tolerant dropdown + filtre scripti
    document.addEventListener("DOMContentLoaded", () => {

    // --- helpers ---
    const normalize = s => {
        if (s == null) return "";
        return String(s)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ")
        .replace(/ğ/g, "g")
        .replace(/ç/g, "c")
        .replace(/ş/g, "s")
        .replace(/ü/g, "u")
        .replace(/ö/g, "o")
        .replace(/ı/g, "i")
        .replace(/İ/g, "i")
        .replace(/[^\w\s-]/g, "") 
        .replace(/\s+/g, ""); 
    };

    const productMatches = (productCat, selectedKey) => {
        if (!productCat) return false;
        selectedKey = normalize(selectedKey);
        if (Array.isArray(productCat)) {
        return productCat.some(c => normalize(c) === selectedKey);
        } else {
        return normalize(productCat) === selectedKey;
        }
    };

    // --- render products full tolerant ---
    const productGrid = document.getElementById("productGrid");
    function renderProducts(categoryKey = "all") {
        if (!productGrid) return;
        productGrid.innerHTML = "";

        if (!window.products || !Array.isArray(window.products)) {
        console.error("products array bulunamadı. products.js yüklü mü?");
        return;
        }

        const normalizedKey = normalize(categoryKey);

        const filtered = (normalizedKey === "all" || normalizedKey === "") 
        ? window.products 
        : window.products.filter(p => productMatches(p.category, normalizedKey));

        // if no results show nothing message (keeps layout)
        if (filtered.length === 0) {
        const msg = document.createElement("div");
        msg.style.gridColumn = "1/-1";
        msg.style.padding = "2rem";
        msg.style.textAlign = "center";
        msg.textContent = "Seçilen kategoride ürün bulunamadı.";
        productGrid.appendChild(msg);
        return;
        }

        filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        try {
            if (Array.isArray(p.category)) {
            card.dataset.category = p.category.map(c => normalize(c)).join(" ");
            } else {
            card.dataset.category = normalize(p.category);
            }
        } catch (e) {
            card.dataset.category = "";
        }

        const imgHtml = p.image ? `<img src="${p.image}" alt="${(p.name||'')}" class="product-image" onerror="this.style.display='none'">` : `<div class="product-noimage">${p.icon||''}</div>`;
        const nameHtml = `<div class="product-name">${p.name||''}</div>`;
        const priceHtml = `<div class="product-price">${p.price||''}</div>`;

        card.innerHTML = `${imgHtml}${nameHtml}${priceHtml}`;

        card.addEventListener("click", (e) => {
            e.stopPropagation();
            if (typeof window.showProduct === "function") {
            // pass fields safely
            window.showProduct(p.icon||"", p.name||"", p.price||"", p.description||"", p.image||"");
            } else {
            console.log("showProduct fonksiyonu bulunmuyor, ürün tıklandı:", p.name);
            }
        });

        productGrid.appendChild(card);
        });
    }

    // --- dropdown open/close ---
    document.querySelectorAll(".dropdown-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
        e.stopPropagation();
        // close others
        document.querySelectorAll(".dropdown").forEach(d => {
            if (d.contains(btn)) return;
            d.classList.remove("show");
        });
        // toggle current
        const parent = btn.closest(".dropdown");
        if (parent) parent.classList.toggle("show");
        });
    });

    // close dropdowns on outside click
    document.addEventListener("click", () => {
        document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
    });

    // --- dropdown items and "all" buttons ---
    const allBtns = document.querySelectorAll(".all-products-btn, .dropdown-btn[data-category='all']");
    allBtns.forEach(b => {
        b.addEventListener("click", (e) => {
        e.stopPropagation();
        // mark active classes consistently
        document.querySelectorAll(".dropdown-item, .all-products-btn").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        renderProducts("all");
        // close dropdowns
        document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
        });
    });

    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", (e) => {
        e.stopPropagation();
        const selected = item.getAttribute("data-category") || "";
        // normalize selected key for debug mapping
        const normalizedSelected = normalize(selected);
        document.querySelectorAll(".dropdown-item, .all-products-btn").forEach(x => x.classList.remove("active"));
        item.classList.add("active");
        renderProducts(normalizedSelected);
        // close dropdowns
        document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
        });
    });

    // initial render
    renderProducts("all");

    }); // DOMContentLoaded end

    document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll("img.lazy");

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; 
                img.classList.remove("lazy");
                obs.unobserve(img);
            }
        });
    }, {
        rootMargin: "200px 0px",
        threshold: 0.1
    });

    lazyImages.forEach(img => observer.observe(img));
});

    
