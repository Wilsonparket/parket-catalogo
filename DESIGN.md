# Design System Document: High-End Wood Texture Catalog

## 1. Overview & Creative North Star: "The Monochromatic Artisan"
This design system is built for a singular purpose: to showcase the tactile, organic luxury of premium wood textures through a lens of extreme digital sophistication. By stripping away all colors except absolute Black (#000000) and absolute White (#FFFFFF), we shift the user's focus entirely toward the rich grain and detail of the product photography.

**Creative North Star: The Monochromatic Artisan.**
The system avoids the "template" look by utilizing dramatic scale contrasts, liquid glass overlays, and intentional asymmetry. We treat the interface not as a grid, but as a digital gallery where high-income users navigate through "atmospheric layers." The experience must feel exclusive, quiet, and profoundly intentional.

---

## 2. Colors: The Binary Palette
In this system, "Gray" does not exist as a hex code; it is a byproduct of opacity and light.

| Token | Value | Role |
| :--- | :--- | :--- |
| `primary` | #FFFFFF | Hero text, primary actions, and "light" glass reflections. |
| `surface` | #000000 | The canvas. Represents the void from which the wood textures emerge. |
| `on-surface` | #FFFFFF | Secondary text and high-contrast iconography. |
| `surface-container` | #FFFFFF (at 5-12% Opacity) | Defining subtle depth and "liquid glass" card backgrounds. |

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited. Sectioning must be achieved through:
*   **Negative Space:** Using large layout gaps to define boundaries.
*   **Tonal Shifts:** Transitioning from a pure `#000000` background to a `surface-container-high` (`#FFFFFF` at 8% opacity).
*   **Glass Overlays:** Using backdrop blurs to define a container’s edge without a stroke.

### The "Glass & Gradient" Rule
To create a "Liquid" feel, use gradients that transition from `#FFFFFF` at 15% opacity to `#FFFFFF` at 2% opacity. This creates a shimmering, translucent effect that feels like polished glass over the dark wood textures.

---

## 3. Typography: The Inter Editorial Scale
We utilize the Inter font family with extreme weight and size variances to create an editorial, high-fashion feel.

*   **Display (L/M/S):** Used for wood collection titles (e.g., "EBONY REVEALED"). Set to `ExtraLight` (200) or `SemiBold` (600) with `-0.04em` letter spacing for an aggressive, premium look.
*   **Headlines:** Used for section starts. `SemiBold` (600) for high-income authority.
*   **Body (L/M/S):** All body text is `Regular` (400) or `Light` (300). Line height is increased to `1.6` to provide "breathing room" for the eyes.
*   **Labels:** Always `Uppercase` with `+0.1em` letter spacing. This conveys a sense of curated "specifications" for the luxury materials.

---

## 4. Elevation & Depth: Tonal Layering
Depth is not simulated with drop shadows; it is felt through light refraction.

*   **The Layering Principle:** Treat the UI as layers of glass. The "Lower" the surface (e.g., `surface-container-lowest`), the darker and more "sunken" it feels. The "Higher" the surface, the more white-opacity is added to the glass.
*   **Liquid Glass Effects:** Any card or floating element must use:
    *   `backdrop-filter: blur(40px);`
    *   `background: rgba(255, 255, 255, 0.08);`
*   **The "Ghost Border" Fallback:** If a container must be defined against a complex wood texture, use a `1px` stroke of `#FFFFFF` at **only 10% opacity**. It should be felt, not seen.

---

## 5. Components

### Cards (The "Signature" Component)
Cards are the primary vehicle for wood textures. 
*   **Radius:** Use `xl` (3rem) for all large product cards.
*   **Behavior:** On hover, the glass opacity should increase from 8% to 15%, and the `backdrop-blur` should intensify.
*   **No Dividers:** Content within the card is separated by `1.5rem` of vertical space, never lines.

### Buttons: The "Obsidian" & "Crystal" Variants
*   **Primary (Crystal):** Pure `#FFFFFF` background with `#000000` Inter SemiBold text. Large `full` (9999px) border radius.
*   **Secondary (Ghost):** No background. `1px` border at 20% white opacity. Text in `#FFFFFF`.
*   **Interaction:** On hover, buttons should "glow" via a subtle white outer glow (Opacity: 10%, Blur: 20px).

### Input Fields
*   **Style:** Underlined only. A `1px` white line at 20% opacity. 
*   **Active State:** The line becomes 100% white and expands `2px` in height. Label moves above in `label-sm` uppercase.

### Liquid Tooltips
*   Floating tooltips for "Texture Details" use `backdrop-filter: blur(20px)` and a `lg` (2rem) border radius to mimic a drop of water on the screen.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts where text overlaps the edge of a wood texture image.
*   **Do** use `display-lg` typography for single, impactful words (e.g., "GRAIN").
*   **Do** ensure all photography is high-contrast to match the #000/#FFF theme.
*   **Do** use white-space as a luxury "material"—more space equals more perceived value.

### Don't:
*   **Don't** use gray. If you need a softer look, lower the opacity of the white text.
*   **Don't** use standard `0.5rem` border radii. This system requires the "oversized" `2rem` to `3rem` look to feel bespoke.
*   **Don't** use drop shadows. Rely on the contrast between the black background and the glass-blurred containers.
*   **Don't** use icons with heavy strokes. Use thin, `Light` weight line icons (0.5pt to 1pt).

---

## 7. Motion & Dynamics
The "Dynamic Feel" is achieved through staggered entrance animations. When a user enters a catalog page, the glass cards should slide up with a "liquid" easing (e.g., `cubic-bezier(0.2, 0.8, 0.2, 1)`), appearing to float into place on top of the black void.