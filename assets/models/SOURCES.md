# Model brand symbols

Local copies of LobeHub Icons brand symbols, retrieved 2026-10-28.
These identify the model providers in the educational simulator. Model names and version labels are scenario content supplied by the project, not claims made by the icon source.

Repository: https://github.com/lobehub/lobe-icons
Pinned revision: `8b7bbc433d38437fa2b0cca58ae896917162b812`
License: MIT; the full notice is in `LICENSE-LobeHub.txt`. The brand names and symbols belong to their respective owners.

| Local asset | Brand | Source | viewBox |
| --- | --- | --- | --- |
| `claude.svg` | Claude / Anthropic | https://raw.githubusercontent.com/lobehub/lobe-icons/8b7bbc433d38437fa2b0cca58ae896917162b812/packages/static-svg/icons/claude-color.svg | `0 0 24 24` |
| `gemini.svg` | Gemini / Google | https://raw.githubusercontent.com/lobehub/lobe-icons/8b7bbc433d38437fa2b0cca58ae896917162b812/packages/static-svg/icons/gemini-color.svg | `0 0 24 24` |
| `openai.svg` | OpenAI / GPT | https://raw.githubusercontent.com/lobehub/lobe-icons/8b7bbc433d38437fa2b0cca58ae896917162b812/packages/static-svg/icons/openai.svg | `0 0 24 24` |

Only local filenames were changed for the Claude and Gemini color variants. SVG artwork is unmodified.

## Display

Use a 20-24px fixed-size image inside a 32px white logo tile; `object-fit: contain; flex: none`. Keep each mark immediately before its visible full model name. The full name supplies the accessible meaning, so a decorative image next to that name should use `alt=""` and `aria-hidden="true"`. When used without a visible label, supply a brand-specific alt value.

The OpenAI SVG uses `currentColor`, which is black when embedded as a standalone image. Keep it on a white or light tile for contrast. Gemini's gradients are internal SVG definitions, not remote resources.

## Safety inspection

All three assets parse as SVG XML. They contain only SVG geometry, titles, and Gemini's internal gradient definitions. No scripts, event handlers, foreignObject, external links, image resources, CSS imports, or external URLs are embedded.
