# Tunnel Bear Login Animation in 12 kB

![Screenshot](https://jensroland.com/projects/bear/screenshot-small.jpg)

A delightful login form implementation inspired by [Addy Osmani's version](https://github.com/addyosmani/tunnel-bear-login) of [The Tunnel Bear](https://www.tunnelbear.com/account/login) by Kadri Jibraan.

This project recreates the charming bear animation that responds to user input and focus states

*...while using 95% less code than Addys version*

*...and adding **more features***

*...and being ***faster***.*

|                              | [Vanilla version (this)](https://jensroland.com/projects/bear/) | [bear.addy.ie](https://bear.addy.ie/) | [Original](https://www.tunnelbear.com/account/login) (*) |
| ---------------------------- | --------------------------------------------: | ------------------------------------: | -------------------------------------------------------: |
| Page load size, initial load |                                         16 kB |                                362 kB |                                                   3.0 MB |
| Page load size, total        |                                         84 kB |                                362 kB |                                                   3.0 MB |
| - HTML, CSS, JS              |                                         12 kB |                                227 kB |                                                   2.8 MB |
| - Images                     |                                         72 kB |                                135 kB |                                                   169 kB |
| Lighthouse score (desktop)   |                                       100/100 |                               100/100 |                                                   93/100 |
| Lighthouse score (mobile)    |                                       100/100 |                               100/100 |                                                   70/100 |

(*) The TunnelBear (original) metrics are not comparable to the others since the login form is part of a live site with tons of unrelated styles and third party scripts.

## Background

In the fall of 2011, Addy Osmani gave an incredible keynote on [Large-scale JavaScript Application Architecture](https://addyosmani.com/blog/large-scale-javascript-application-architecture/) at the jQuery Summit. Following this talk, I set out to build a JavaScript framework based on the principles he outlined. This framework, which I named *Tomahawk*, went on to be used in production for the following ~6 years at one of the largest web sites in Denmark.

I can trace a significant part of my career back to this talk and the work of pioneers like Addy Osmani, Nicholas Zakas, Steve Souders, Lance Arthur, Makinde Adeagbo, and Lea Verou. Suffice it to say that I am a long-time fan of Addy Osmani's work and I wanted to pay homage to that by recreating one of his projects *and perhaps being a little bit cheeky about it*.

## Features

- Interactive bear animation that responds to email input length
  - Added: Accurate bear gaze tracking of all character widths
  - Added: Smooth animations when removing or inserting many characters at once
  - Added: Bear returns to idle state when the form loses focus
- Playful hide animation when focusing on the password field
  - Changed: More natural transitions between 'watching' and 'peeking' states

## Project Structure

The project is oldschool with a single HTML file, some JavaScript files, and a few stylesheets. No `node_modules` or build steps required. 🍾 Party like it's 2011 🍾

```plaintext
📁 public/
├── 📄 index.html             # Main HTML file
├── 📁 img/
|   ├── 🐻 bear_idle.webp     # Bear idle image
|   ├── 🐻 bear_sprite.webp   # Bear animation sprite sheet
|   └── 🐻 favicon-32x32.png  # Favicon
├── 📁 scripts/
|   ├── 📄 main.js            # Main JS file
|   └── ...
└── 📁 styles/
    ├── 📄 main.css           # Main CSS file
    └── ...
```

## Technical Details

- Built with semantic HTML, vanilla JS and modern CSS for accessibility, readability, and performance
- Progressive Enhancement: Login form works as expected without JS
- Modular architecture with ES6 modules
- Text width measured with Canvas for accurate bear gaze tracking
- Performance optimizations:
  - Images resized to native 1x resolution and converted to .webp for smaller file sizes
  - Dropped Tailwind and React for better performance
  - Animation frames combined into a CSS sprite for better compression and smoother animation
  - Keyframe animation using vanilla CSS and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) for smoother, flicker-free animations
  - Initial page load only needs one small image, the sprite is lazyloaded on form mouseover and seamlessly sits on top of the idle image, eliminating flicker
- Custom 'state machine' for bear animation states and transitions
- No Node.js or build step required, for fast development and deployment

## Development

1. Run `make serve` and open <http://localhost:3000> in a browser.

    Note: this uses [npx](https://docs.npmjs.com/cli/v8/commands/npx) under the hood.

2. For production, upload the `public` folder to your server or CDN.

    Or, for the best performance, run `make build` to minify, bundle and inline the assets, then upload the `dist` folder to your server or CDN. You will need to change the `IMAGES_PATH` in the Makefile to match your server setup.

## Credits

This project is a vanilla implementation inspired by [The Tunnel Bear](https://www.tunnelbear.com/account/login) login form created by Kadri Jibraan, and the subsequent [React implementation](https://github.com/addyosmani/tunnel-bear-login) created by Addy Osmani.

Peek animations and show/hide SVGs contributed/created by [Luca Frigato](https://github.com/FrigaZzz).

All remaining bear animations and design concepts are credited to the original work.

## License

This project is for educational purposes only. The original design and animations are property of TunnelBear.
