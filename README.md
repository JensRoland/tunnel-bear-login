# Tunnel Bear Login Animation

![Screenshot](https://jensroland.com/projects/bear/screenshot.jpg)

A delightful login form implementation inspired by [Addy Osmani's version](https://github.com/addyosmani/tunnel-bear-login) of [The Tunnel Bear](https://www.tunnelbear.com/account/login) by Kadri Jibraan.

This project recreates the charming bear animation that responds to user input and focus states.

## Background

Back in 2011 Addy Osmani did an incredible talk on [Large-scale JavaScript Application Architecture](https://addyosmani.com/blog/large-scale-javascript-application-architecture/) at the 2011 jQuery Summit. Following this talk, I set out to build a JavaScript framework based on the principles he outlined. This framework was called Tomahawk and it went on to be used in production for the following ~6 years at one of the largest web sites in Denmark at the time.

I can trace a significant part of my career back to this talk and the work of pioneers like Addy Osmani, Nicholas Zakas, Lance Arthur, Makinde Adeagbo, and Lea Verou. Suffice it to say that I am a long-time fan of Addy Osmani's work and I wanted to pay homage to that by recreating one of his projects.

## Features

- Interactive bear animation that responds to email input length
  - Accurate bear gaze tracking of all character widths
  - Smooth animations when removing or inserting many characters at once
  - Bear returns to idle state when the form loses focus
- Playful hide animation when focusing on the password field
  - More natural transitions between 'watching' and 'peeking' states

## Project Structure

The project is oldschool with a single HTML file, a script, and a few stylesheets.

```sh
📁 public/
├── 📄 index.html             # Main HTML file
├── 📁 img/
|   ├── 🐻 bear_idle.webp     # Bear idle image
|   ├── 🐻 bear_sprite.webp   # Bear animation sprite sheet
|   └── 🐻 favicon-32x32.png  # Favicon
├── 📁 scripts/
|   └── 📄 main.js            # Form and animation logic
└── 📁 styles/                # CSS
```


## Technical Details

- Built with semantic HTML, vanilla JS and modern CSS for accessibility, readability, and performance
- Progressive Enhancement: Login form works as expected without JS
- Text width measured with Canvas for accurate bear gaze tracking
- Performance optimizations:
  - Images resized to native 1x resolution and converted to .webp for smaller file sizes
  - Dropped Tailwind and React for better performance
  - Animation frames combined into a CSS sprite for better compression and smoother animation
  - Keyframe animation using vanilla CSS and the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) for smoother, flicker-free animations
  - Initial page load only needs one small image, the sprite is lazyloaded when the browser is idle
  - Total page weight of 85kB uncompressed (13kB plus images), compared to 357kB (222kB plus images) for Addys implementation as of February 19, 2025
- Minimal state machine for bear animation states
- No Node.js or build step required, for fast development and deployment

## Development

1. Open `public/index.html` in your browser.

🍾 Party like it's 2011 🍾

1. For production, upload the `public` folder to your server or CDN.

Or, for the best performance, run `make build` to minify, bundle and inline the assets (uses [npx](https://docs.npmjs.com/cli/v8/commands/npx) under the hood), then upload the `dist` folder to your server or CDN. You will need to change the IMAGES_PATH in the Makefile to match your server setup.

## Credits

This project is a vanilla implementation inspired by [The Tunnel Bear](https://www.tunnelbear.com/account/login) login form created by Kadri Jibraan, and the subsequent [React implementation](https://github.com/addyosmani/tunnel-bear-login) created by Addy Osmani.

Peek animations and show/hide SVGs contributed/created by [Luca Frigato](https://github.com/FrigaZzz).

<a href="https://www.freepik.com/icons/bear">Favicon by Freepik</a>

All remaining bear animations and design concepts are credited to the original work.

## License

This project is for educational purposes only. The original design and animations are property of TunnelBear.
