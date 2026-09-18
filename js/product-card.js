const card = document.getElementById('product-card');

if (card) {
  const refs = {
    price: card.querySelector('[data-role="price"]'),
    oldPrice: card.querySelector('[data-role="old-price"]'),
    save: card.querySelector('[data-role="save"]'),
    sku: card.querySelector('[data-role="sku"]'),
    badge: card.querySelector('[data-role="badge"]'),
    meta: card.querySelector('[data-role="price-meta"]'),
    cart: card.querySelector('[data-role="cart"]'),
  };

  const oldPriceLine = refs.oldPrice.closest('.price__old');
  const cartLabel = refs.cart.querySelector('.button__label');
  let cartTimer = null;

  const formatPrice = (value) => {
    const rounded = Math.round(value * 100) / 100;

    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(rounded);
  };

  const applyVariant = (input) => {
    const price = Number(input.dataset.price);
    const oldPrice = Number(input.dataset.oldPrice);
    const hasDiscount = oldPrice > price;

    refs.price.textContent = formatPrice(price);
    refs.sku.textContent = input.dataset.sku;
    refs.meta.setAttribute('content', price.toFixed(2));

    oldPriceLine.hidden = !hasDiscount;
    refs.badge.hidden = !hasDiscount;

    if (hasDiscount) {
      refs.oldPrice.textContent = formatPrice(oldPrice);
      refs.save.textContent = `выгода ${formatPrice(oldPrice - price)}`;
      refs.badge.textContent = `−${Math.round((1 - price / oldPrice) * 100)}%`;
    }
  };

  card.addEventListener('change', ({ target }) => {
    if (target.matches('.variant__input')) {
      applyVariant(target);
    }
  });

  card.addEventListener('submit', (event) => {
    event.preventDefault();

    refs.cart.classList.add('is-added');
    cartLabel.textContent = 'Добавлено';

    clearTimeout(cartTimer);
    cartTimer = setTimeout(() => {
      refs.cart.classList.remove('is-added');
      cartLabel.textContent = 'В корзину';
    }, 2000);
  });

  applyVariant(card.querySelector('.variant__input:checked'));
}

const favorite = document.querySelector('[data-role="favorite"]');

if (favorite) {
  const storageKey = 'teaboom:favorite:ananasovij-ulun';

  const storage = {
    read: () => {
      try {
        return localStorage.getItem(storageKey) === '1';
      } catch {
        return false;
      }
    },
    write: (isActive) => {
      try {
        localStorage.setItem(storageKey, isActive ? '1' : '0');
        return true;
      } catch {
        return false;
      }
    },
  };

  const setFavorite = (isActive) => {
    favorite.setAttribute('aria-pressed', String(isActive));
    favorite.setAttribute(
      'aria-label',
      isActive ? 'Убрать из избранного' : 'Добавить в избранное',
    );
    storage.write(isActive);
  };

  favorite.addEventListener('click', () => {
    setFavorite(favorite.getAttribute('aria-pressed') !== 'true');
  });

  if (storage.read()) {
    setFavorite(true);
  }
}

const lightbox = document.querySelector('[data-role="lightbox"]');
const reviewDialog = document.querySelector('[data-role="review"]');

const supportsDialog = typeof HTMLDialogElement === 'function';

const openDialog = (dialog) => {
  if (!dialog) {
    return;
  }

  if (supportsDialog) {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
};

const closeDialog = (dialog) => {
  if (supportsDialog) {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }
};

if (!supportsDialog) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('dialog[open]').forEach(closeDialog);
    }
  });
}

document.querySelectorAll('[data-role="zoom"], .gallery__image').forEach((node) => {
  node.addEventListener('click', () => openDialog(lightbox));
});

document.querySelector('[data-role="review-open"]')?.addEventListener('click', () => {
  openDialog(reviewDialog);
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('[data-role="dialog-close"]')?.addEventListener('click', () => {
    closeDialog(dialog);
  });

  dialog.addEventListener('click', ({ target }) => {
    if (target === dialog) {
      closeDialog(dialog);
    }
  });
});

const reviewForm = document.querySelector('[data-role="review-form"]');
const reviewThanks = document.querySelector('[data-role="review-thanks"]');

reviewForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  reviewForm.hidden = true;
  reviewThanks.hidden = false;

  setTimeout(() => {
    closeDialog(reviewDialog);
    reviewForm.reset();
    reviewForm.hidden = false;
    reviewThanks.hidden = true;
  }, 1800);
});
