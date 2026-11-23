import { useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, PointerEvent } from "react";
import { Link } from "react-router-dom";
import { ExplorerCanvas } from "./ProductScene";

const finishes = [
  { name: "Space Gray", className: "finish-space-gray", color: "#858b94" },
  { name: "Silver", className: "finish-silver", color: "#d0d3d8" },
  { name: "Midnight", className: "finish-midnight", color: "#383b40" },
  { name: "Starlight", className: "finish-starlight", color: "#d8c8ad" },
];

const addOns = [
  {
    id: "memory",
    label: "Memory upgrade",
    description: "24 GB unified memory for demanding projects.",
    price: 200,
  },
  {
    id: "storage",
    label: "Storage upgrade",
    description: "1 TB SSD for your files, apps, and ideas.",
    price: 300,
  },
  {
    id: "protection",
    label: "Extended protection",
    description: "Extra coverage and support for your MacBook.",
    price: 199,
  },
  {
    id: "accessory",
    label: "Travel accessory kit",
    description: "A compact sleeve and USB-C adapter.",
    price: 89,
  },
];

const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function OrderPage() {
  const [finish, setFinish] = useState("Silver");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [lidOpen, setLidOpen] = useState(true);
  const [previewDocked, setPreviewDocked] = useState(true);
  const [previewPosition, setPreviewPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const previewRef = useRef<HTMLElement>(null);
  const restorePreviewPositionRef = useRef<{ x: number; y: number } | null>(
    null,
  );
  const previewDragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const selectedFinish = finishes.find((option) => option.name === finish);

  const total =
    1499 +
    addOns.reduce(
      (price, addOn) =>
        price + (selectedAddOns.includes(addOn.id) ? addOn.price : 0),
      0,
    );

  function toggleAddOn(id: string) {
    setSelectedAddOns((selected) =>
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
    setOrderPlaced(false);
  }

  function chooseFinish(name: string) {
    setFinish(name);
    setOrderPlaced(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderPlaced(true);
  }

  function togglePreviewDocked() {
    if (previewDocked) {
      setPreviewPosition(restorePreviewPositionRef.current);
      restorePreviewPositionRef.current = null;
      setPreviewDocked(false);
      return;
    }

    restorePreviewPositionRef.current = previewPosition;
    setPreviewDocked(true);
  }

  function startPreviewDrag(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;

    const preview = previewRef.current;
    if (!preview) return;

    event.preventDefault();
    const bounds = preview.getBoundingClientRect();
    previewDragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setPreviewPosition({ x: bounds.left, y: bounds.top });
  }

  function movePreview(event: PointerEvent<HTMLButtonElement>) {
    const drag = previewDragRef.current;
    const preview = previewRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !preview) return;

    const bounds = preview.getBoundingClientRect();
    setPreviewPosition({
      x: Math.max(
        8,
        Math.min(event.clientX - drag.offsetX, window.innerWidth - bounds.width - 8),
      ),
      y: Math.max(
        8,
        Math.min(event.clientY - drag.offsetY, window.innerHeight - bounds.height - 8),
      ),
    });
  }

  function movePreviewWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const directions: Record<string, [number, number]> = {
      ArrowDown: [0, 24],
      ArrowLeft: [-24, 0],
      ArrowRight: [24, 0],
      ArrowUp: [0, -24],
    };
    const direction = directions[event.key];
    const preview = previewRef.current;
    if (!direction || !preview) return;

    event.preventDefault();
    const bounds = preview.getBoundingClientRect();
    const currentPosition = previewPosition ?? { x: bounds.left, y: bounds.top };
    setPreviewPosition({
      x: Math.max(
        8,
        Math.min(currentPosition.x + direction[0], window.innerWidth - bounds.width - 8),
      ),
      y: Math.max(
        8,
        Math.min(currentPosition.y + direction[1], window.innerHeight - bounds.height - 8),
      ),
    });
  }

  return (
    <main className="order-page">
      <section className="order-hero" id="order-top">
        <div className="order-hero-seal" aria-hidden="true">
          <strong>MP</strong>
          <i />
          <small>02 / 04</small>
        </div>
        <p className="eyebrow">
          <span className="eyebrow-dot" /> Your next big idea starts here
        </p>
        <h1>Make it yours.</h1>
        <p>
          Choose a finish, add the features that fit your work, and review your
          configuration.
        </p>
        <a className="nav-cta" href="#order-options">
          Build your MacBook <span aria-hidden="true">↓</span>
        </a>
        <div className="order-hero-art" aria-hidden="true">
          <span className="order-hero-orbit order-hero-orbit-one" />
          <span className="order-hero-orbit order-hero-orbit-two" />
          <span className="order-hero-glow" />
          <span className="order-hero-mark">M</span>
        </div>
      </section>

      <form className="order-builder" onSubmit={handleSubmit}>
        <section className="order-options-card" id="order-options">
          <div className="order-section-heading">
            <p className="eyebrow">01 / Configure</p>
            <h2>Choose your setup.</h2>
            <p>Every choice is optional. Start with the essentials.</p>
          </div>

          <fieldset className="finish-fieldset">
            <legend>Choose a finish</legend>
            <div className="finish-options">
              {finishes.map((option) => (
                <label
                  className={`finish-option${finish === option.name ? " finish-option--selected" : ""}`}
                  key={option.name}
                >
                  <input
                    type="radio"
                    name="finish"
                    value={option.name}
                    checked={finish === option.name}
                    onChange={() => chooseFinish(option.name)}
                  />
                  <span
                    className={`finish-swatch ${option.className}`}
                    aria-hidden="true"
                  />
                  <span>{option.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="addon-fieldset">
            <legend>Add optional upgrades</legend>
            <div className="addon-list">
              {addOns.map((addOn) => {
                const checked = selectedAddOns.includes(addOn.id);
                return (
                  <label
                    className={`addon-option${checked ? " addon-option--selected" : ""}`}
                    key={addOn.id}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddOn(addOn.id)}
                    />
                    <span className="addon-check" aria-hidden="true">+</span>
                    <span className="addon-copy">
                      <strong>{addOn.label}</strong>
                      <small>{addOn.description}</small>
                    </span>
                    <span className="addon-price">
                      +{formatPrice.format(addOn.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <p className="order-sample-note">
            Sample USD pricing for this demo. No payment is collected.
          </p>
        </section>

        <aside className="order-summary-card" id="order-summary">
          <div className="order-summary-top">
            <span className="order-summary-index">CONFIGURATION / 01</span>
            <span className="order-summary-dot" aria-hidden="true" />
          </div>
          <div className="order-summary-product">
            <div className="order-summary-device" aria-hidden="true">
              <span />
            </div>
            <div>
              <p>MacBook Pro</p>
              <small>{finish} finish</small>
            </div>
          </div>
          <div className="order-summary-items">
            <div>
              <span>MacBook Pro</span>
              <span>{formatPrice.format(1499)}</span>
            </div>
            {addOns
              .filter((addOn) => selectedAddOns.includes(addOn.id))
              .map((addOn) => (
                <div key={addOn.id}>
                  <span>{addOn.label}</span>
                  <span>{formatPrice.format(addOn.price)}</span>
                </div>
              ))}
          </div>
          <div className="order-summary-total">
            <span>Estimated total</span>
            <strong>{formatPrice.format(total)}</strong>
          </div>
          <button className="order-submit" type="submit">
            Place demo order <span aria-hidden="true">→</span>
          </button>
          <p className="order-summary-disclaimer">
            This is a demo configuration. It does not place a real order or
            collect payment.
          </p>
          {orderPlaced && (
            <p className="order-confirmation" role="status">
              Your demo configuration is ready. You can still change any
              selection above.
            </p>
          )}
          <Link className="order-back-link" to="/product">
            Explore product details
          </Link>
        </aside>
      </form>

      <aside
        ref={previewRef}
        className={`order-preview-window${previewDocked ? " order-preview-window--docked" : ""}`}
        aria-label="Interactive MacBook preview"
        style={
          !previewDocked && previewPosition
            ? {
                position: "fixed",
                left: previewPosition.x,
                top: previewPosition.y,
                right: "auto",
                bottom: "auto",
              }
            : undefined
        }
      >
        <div className="order-preview-heading">
          <div>
            <p className="eyebrow">Live preview</p>
            <span>{finish} finish</span>
          </div>
          <div className="order-preview-window-actions">
            <button
              aria-label={
                previewDocked
                  ? "Restore preview position and size"
                  : "Shrink and dock preview"
              }
              aria-pressed={previewDocked}
              className="order-preview-size-toggle"
              onClick={togglePreviewDocked}
              type="button"
            >
              <span aria-hidden="true">{previewDocked ? "⤢" : "↘"}</span>
            </button>
            <button
              aria-label="Move live preview; use arrow keys to reposition"
              className="order-preview-move"
              disabled={previewDocked}
              onKeyDown={movePreviewWithKeyboard}
              onPointerCancel={() => {
                previewDragRef.current = null;
              }}
              onPointerDown={startPreviewDrag}
              onPointerMove={movePreview}
              onPointerUp={() => {
                previewDragRef.current = null;
              }}
              type="button"
            >
              <span aria-hidden="true">⠿</span>
            </button>
          </div>
        </div>
        <div className="order-preview-canvas">
          <ExplorerCanvas
            resetToken={resetToken}
            lidOpen={lidOpen ? 1 : 0}
            finishColor={selectedFinish?.color}
          />
        </div>
        <div className="order-preview-finishes" aria-label="Choose laptop finish">
          {finishes.map((option) => (
            <button
              aria-label={`Choose ${option.name} finish`}
              aria-pressed={finish === option.name}
              className={`finish-swatch ${option.className}`}
              key={option.name}
              onClick={() => chooseFinish(option.name)}
              title={option.name}
              type="button"
            />
          ))}
        </div>
        <div className="order-preview-actions">
          <button
            className="order-preview-button"
            onClick={() => setResetToken((token) => token + 1)}
            type="button"
          >
            <span aria-hidden="true">↺</span> Reset view
          </button>
          <button
            aria-pressed={!lidOpen}
            className="order-preview-button"
            onClick={() => setLidOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true">{lidOpen ? "↓" : "↑"}</span>
            {lidOpen ? "Close laptop" : "Open laptop"}
          </button>
        </div>
      </aside>

      <footer className="site-footer order-footer">
        <span>MacBook Pro</span>
        <span>Designed for your next big idea.</span>
      </footer>
    </main>
  );
}
