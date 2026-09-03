# Temperature Converter

A small, dependency-free web tool that converts between Celsius, Fahrenheit,
and Kelvin in real time, with input validation and absolute-zero handling.

Built with plain HTML5, CSS3, and vanilla JavaScript — no build step, no
framework, no npm install required.

**Live demo:** https://sol-temprature-converter.vercel.app

## Features

- Numeric input with validation (rejects non-numeric input with an inline error)
- Unit selector (Celsius / Fahrenheit / Kelvin) as a segmented control
- All three converted values shown simultaneously on Convert
- Absolute-zero guard: values below −273.15 °C / −459.67 °F / 0 K show a
  friendly explanation instead of a nonsensical result
- A live thermometer readout that tracks the entered value
- Centered, accessible layout with visible focus states and
  `prefers-reduced-motion` support

## Run it locally

No build tools needed — just open `index.html` in a browser, or serve the
folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Project structure

```
.
├── index.html    # markup
├── style.css     # design system + layout
├── script.js     # conversion logic, validation, UI updates
├── favicon.svg
└── README.md
```

## Deploy

See the deployment walkthrough below for pushing this to GitHub and
deploying it on Vercel.
