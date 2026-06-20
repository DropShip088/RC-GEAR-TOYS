(function () {
  const whatsappNumber = "918988520742";
  const products = window.RCG_PRODUCTS || [];
  const cartKey = "rcGearToysCart";
  const cartNumberKey = "rcGearToysCartNumber";
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

  const grid = document.querySelector("#productGrid");
  const template = document.querySelector("#productTemplate");
  const searchInput = document.querySelector("#searchInput");
  const pageFilter = document.querySelector("#pageFilter");
  const sizeFilter = document.querySelector("#sizeFilter");
  const sortSelect = document.querySelector("#sortSelect");
  const resultCount = document.querySelector("#resultCount");
  const cartDrawer = document.querySelector("#cartDrawer");
  const cartItems = document.querySelector("#cartItems");
  const cartCount = document.querySelector("#cartCount");
  const cartTotal = document.querySelector("#cartTotal");
  const cartNumber = document.querySelector("#cartNumber");
  const whatsappCheckout = document.querySelector("#whatsappCheckout");
  const modal = document.querySelector("#productModal");
  const modalMedia = document.querySelector("#modalMedia");
  const modalThumbnails = document.querySelector("#modalThumbnails");
  const modalMeta = document.querySelector("#modalMeta");
  const modalTitle = document.querySelector("#modalTitle");
  const modalDescription = document.querySelector("#modalDescription");
  const modalSpecs = document.querySelector("#modalSpecs");
  const modalPrice = document.querySelector("#modalPrice");
  const modalAddToCart = document.querySelector("#modalAddToCart");
  const modalOpenCart = document.querySelector("#modalOpenCart");
  const modalBadges = document.querySelector("#modalBadges");
  const modalStock = document.querySelector("#modalStock");
  const modalVariants = document.querySelector("#modalVariants");
  const modalDetailDescription = document.querySelector("#modalDetailDescription");

  let activeProduct = null;
  let cart = loadCart();

  function sellingPrice(product) {
    const tierPrices = {
      699: 699,
      700: 699,
      1000: 999,
      1200: 1199,
      1500: 1499,
      1800: 1499
    };
    return tierPrices[product.price] || product.price;
  }

  function compareAtPrice(product) {
    const originalPrices = {
      700: 1999,
      1000: 2499,
      1200: 2999,
      1500: 4999,
      1800: 5999
    };
    return product.compareAtPrice || originalPrices[product.price] || product.price + 2000;
  }

  function formatPrice(value) {
    return `Rs. ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  function priceMarkup(product) {
    return `
      <span class="old-price">${formatPrice(compareAtPrice(product))}</span>
      <span class="sale-price">${formatPrice(sellingPrice(product))}</span>
    `;
  }

  function safeDetailHtml(html, fallback) {
    return (html || `<p>${fallback || ""}</p>`)
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "");
  }

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(cartKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  function getCartNumber() {
    let value = localStorage.getItem(cartNumberKey);
    if (!value) {
      value = "RCG-" + Date.now().toString().slice(-6);
      localStorage.setItem(cartNumberKey, value);
    }
    return value;
  }

  function makeCarArt(product) {
    const colorMap = {
      Black: "#18181b",
      Blue: "#2563eb",
      "Sky Blue": "#38bdf8",
      Cream: "#f5e7c8",
      Green: "#16a34a",
      Grey: "#64748b",
      Orange: "#f97316",
      Purple: "#7c3aed",
      Red: "#dc2626",
      Silver: "#94a3b8",
      White: "#f8fafc",
      Yellow: "#facc15"
    };
    const bodyColor = colorMap[product.color] || "#ef4444";
    const darkWheels = product.color === "Black" ? "#52525b" : "#111111";

    return `
      <svg viewBox="0 0 420 260" role="img" aria-label="${product.name}">
        <defs>
          <linearGradient id="shine-${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/>
            <stop offset="45%" stop-color="${bodyColor}"/>
            <stop offset="100%" stop-color="#111111" stop-opacity=".72"/>
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="18" fill="#f5f5f0"/>
        <path d="M45 182h330" stroke="#c7d2fe" stroke-width="8" stroke-linecap="round"/>
        <path d="M88 151l42-50h112l54 50h50c16 0 29 13 29 29v10H54v-8c0-17 14-31 31-31h3z" fill="url(#shine-${product.id})"/>
        <path d="M139 109h92l38 41H104l35-41z" fill="#e0f2fe" opacity=".85"/>
        <path d="M238 112l35 38" stroke="#111111" stroke-opacity=".2" stroke-width="5"/>
        <circle cx="122" cy="190" r="35" fill="${darkWheels}"/>
        <circle cx="304" cy="190" r="35" fill="${darkWheels}"/>
        <circle cx="122" cy="190" r="16" fill="#e5e7eb"/>
        <circle cx="304" cy="190" r="16" fill="#e5e7eb"/>
        <path d="M69 165h40" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity=".8"/>
        <path d="M302 155h40" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity=".5"/>
      </svg>
    `;
  }

  function productImageMarkup(product) {
    if (!product.image) {
      return makeCarArt(product);
    }

    return `
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        referrerpolicy="no-referrer"
      >
    `;
  }

  function mediaImageMarkup(src, alt) {
    return `
      <img
        src="${src}"
        alt="${alt}"
        loading="lazy"
        referrerpolicy="no-referrer"
      >
    `;
  }

  function mediaVideoMarkup(video, title) {
    return `
      <video controls playsinline preload="none" poster="${video.poster || ""}" aria-label="${title}">
        <source src="${video.src}" type="video/mp4">
      </video>
    `;
  }

  function proxiedImageUrl(imageUrl) {
    const withoutProtocol = imageUrl.replace(/^https?:\/\//, "");
    return `https://images.weserv.nl/?url=${encodeURIComponent(withoutProtocol)}`;
  }

  function renderProductMedia(container, product) {
    container.innerHTML = productImageMarkup(product);
    const image = container.querySelector("img");
    if (image) {
      image.addEventListener("error", () => {
        if (image.dataset.retry !== "proxy") {
          image.dataset.retry = "proxy";
          image.src = proxiedImageUrl(product.image);
          return;
        }
        container.innerHTML = makeCarArt(product);
      });
    }
  }

  function enableImageRetry(image) {
    if (!image) return;
    image.addEventListener("error", () => {
      if (image.dataset.retry === "proxy") return;
      image.dataset.retry = "proxy";
      image.src = proxiedImageUrl(image.src);
    });
  }

  function mediaItems(product) {
    const images = (product.gallery && product.gallery.length ? product.gallery : [product.image])
      .filter(Boolean)
      .map((src) => ({ type: "image", src }));
    if (product.video && product.video.src) {
      images.push({ type: "video", src: product.video.src, poster: product.video.poster });
    }
    return images;
  }

  function renderModalMedia(product, index) {
    const items = mediaItems(product);
    const item = items[index] || items[0];
    if (!item) {
      modalMedia.innerHTML = makeCarArt(product);
      return;
    }

    modalMedia.innerHTML = item.type === "video"
      ? mediaVideoMarkup(item, product.name)
      : mediaImageMarkup(item.src, product.name);

    const image = modalMedia.querySelector("img");
    if (image) {
      image.addEventListener("error", () => {
        if (image.dataset.retry !== "proxy") {
          image.dataset.retry = "proxy";
          image.src = proxiedImageUrl(image.src);
          return;
        }
        modalMedia.innerHTML = makeCarArt(product);
      });
    }

    modalThumbnails.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === index);
    });
  }

  function renderModalThumbnails(product) {
    const items = mediaItems(product);
    modalThumbnails.innerHTML = "";

    items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "media-thumb";
      button.setAttribute("aria-label", `View media ${index + 1}`);
      button.innerHTML = item.type === "video"
        ? `${mediaImageMarkup(item.poster || product.image, product.name)}<span>Video</span>`
        : mediaImageMarkup(item.src, product.name);
      button.addEventListener("click", () => renderModalMedia(product, index));
      modalThumbnails.appendChild(button);

      const image = button.querySelector("img");
      if (image) enableImageRetry(image);
    });
  }

  function renderVariants(product) {
    const variants = product.variants || [];
    modalVariants.innerHTML = "";
    variants
      .filter((variant) => variant.name && variant.name !== "Title" && variant.values && variant.values.length)
      .forEach((variant) => {
        const group = document.createElement("div");
        group.className = "variant-group";
        group.innerHTML = `<strong>${variant.name}</strong>`;
        const options = document.createElement("div");
        options.className = "variant-options";
        variant.values.forEach((value) => {
          const pill = document.createElement("span");
          pill.textContent = value;
          options.appendChild(pill);
        });
        group.appendChild(options);
        modalVariants.appendChild(group);
      });
  }

  function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const page = pageFilter.value;
    const size = sizeFilter.value;

    let filtered = products.filter((product) => {
      const matchesSearch = [product.name, product.type, product.size, product.color]
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesPage = page === "all" || String(product.page) === page;
      const matchesSize = size === "all" || product.size === size;
      return matchesSearch && matchesPage && matchesSize;
    });

    if (sortSelect.value === "price-low") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "price-high") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortSelect.value === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort((a, b) => a.page - b.page || a.id.localeCompare(b.id));
    }

    return filtered;
  }

  function renderProducts() {
    const visibleProducts = filterProducts();
    grid.innerHTML = "";
    resultCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;

    if (!visibleProducts.length) {
      grid.innerHTML = '<p class="empty-state">No products found. Try another search or filter.</p>';
      return;
    }

    visibleProducts.forEach((product) => {
      const node = template.content.cloneNode(true);
      const card = node.querySelector(".product-card");
      const media = node.querySelector(".product-media");
      const tag = node.querySelector(".product-tag");
      const page = node.querySelector(".product-page");
      const title = node.querySelector("h3");
      const description = node.querySelector("p");
      const price = node.querySelector("strong");
      const addButton = node.querySelector(".product-card-footer button");

      card.dataset.productId = product.id;
      renderProductMedia(media, product);
      media.addEventListener("click", () => openProduct(product));
      tag.textContent = product.size;
      page.textContent = `Page ${product.page}`;
      title.textContent = product.name;
      description.textContent = product.shortDescription || product.description;
      price.innerHTML = priceMarkup(product);
      addButton.addEventListener("click", () => addToCart(product.id));
      grid.appendChild(node);
    });
  }

  function addToCart(productId) {
    const line = cart.find((item) => item.id === productId);
    if (line) {
      line.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }
    saveCart();
    renderCart();
    openCart();
  }

  function changeQuantity(productId, amount) {
    const line = cart.find((item) => item.id === productId);
    if (!line) return;
    line.quantity += amount;
    if (line.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
    saveCart();
    renderCart();
  }

  function cartDetails() {
    return cart
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.id);
        return product ? { ...product, quantity: item.quantity, salePrice: sellingPrice(product) } : null;
      })
      .filter(Boolean);
  }

  function renderCart() {
    const lines = cartDetails();
    const totalItems = lines.reduce((sum, item) => sum + item.quantity, 0);
    const total = lines.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    const currentCartNumber = getCartNumber();

    cartCount.textContent = totalItems;
    cartTotal.textContent = formatPrice(total);
    cartNumber.textContent = currentCartNumber;
    cartItems.innerHTML = "";

    if (!lines.length) {
      cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add RC cars from the catalog.</p>';
      whatsappCheckout.classList.add("disabled");
      whatsappCheckout.href = "#";
      return;
    }

    lines.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-line";
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <span>${formatPrice(item.salePrice)} x ${item.quantity}</span>
        </div>
        <div class="quantity-controls">
          <button type="button" aria-label="Reduce ${item.name}">-</button>
          <span>${item.quantity}</span>
          <button type="button" aria-label="Increase ${item.name}">+</button>
        </div>
      `;
      const buttons = row.querySelectorAll("button");
      buttons[0].addEventListener("click", () => changeQuantity(item.id, -1));
      buttons[1].addEventListener("click", () => changeQuantity(item.id, 1));
      cartItems.appendChild(row);
    });

    whatsappCheckout.classList.remove("disabled");
    whatsappCheckout.href = buildWhatsappLink(lines, total, currentCartNumber);
  }

  function buildWhatsappLink(lines, total, currentCartNumber) {
    const productLines = lines
      .map((item, index) => {
        const lineTotal = item.salePrice * item.quantity;
        const qtyText = item.quantity > 1 ? ` x ${item.quantity}` : "";
        return `${index + 1}. ${item.name}${qtyText} - ${formatPrice(lineTotal)}`;
      })
      .join("\n");

    const message = `Hello RC GEAR TOYS 👋

Cart Number: ${currentCartNumber}

I would like to order:

${productLines}

Total: ${formatPrice(total)}

Please confirm availability, delivery charges, and payment details.`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function openCart() {
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
  }

  function closeCart() {
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
  }

  function openProduct(product) {
    activeProduct = product;
    renderModalThumbnails(product);
    renderModalMedia(product, 0);
    modalMeta.textContent = `${product.size} ${product.type} | ${product.source}`;
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.shortDescription || product.description;
    modalPrice.innerHTML = priceMarkup(product);
    modalStock.textContent = product.available === false ? "Check stock" : "Available";
    modalStock.classList.toggle("limited", product.available === false);
    modalBadges.innerHTML = `
      <span>WhatsApp order</span>
      <span>Manual payment</span>
      <span>${mediaItems(product).length} media</span>
    `;
    renderVariants(product);
    modalSpecs.innerHTML = `
      <div><span>Size</span><strong>${product.size}</strong></div>
      <div><span>Scale</span><strong>${product.scale}</strong></div>
      <div><span>Color</span><strong>${product.color}</strong></div>
      <div><span>Type</span><strong>${product.type}</strong></div>
    `;
    modalDetailDescription.innerHTML = safeDetailHtml(product.detailHtml, product.description);
    modal.setAttribute("aria-hidden", "false");
  }

  function closeProduct() {
    modal.setAttribute("aria-hidden", "true");
    activeProduct = null;
  }

  [searchInput, pageFilter, sizeFilter, sortSelect].forEach((control) => {
    control.addEventListener("input", renderProducts);
    control.addEventListener("change", renderProducts);
  });

  document.querySelector("#openCart").addEventListener("click", openCart);
  enableImageRetry(document.querySelector(".hero-car-image"));
  document.querySelector("#closeCart").addEventListener("click", closeCart);
  document.querySelector("#closeCartBackdrop").addEventListener("click", closeCart);
  document.querySelector("#closeModal").addEventListener("click", closeProduct);
  document.querySelector("#modalBackdrop").addEventListener("click", closeProduct);
  modalAddToCart.addEventListener("click", () => {
    if (activeProduct) addToCart(activeProduct.id);
    closeProduct();
  });
  modalOpenCart.addEventListener("click", () => {
    closeProduct();
    openCart();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeProduct();
    }
  });

  renderProducts();
  renderCart();
})();
