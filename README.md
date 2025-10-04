# GIF Picker

A simple GIF picker using the GIPHY API. Built for a job interview.

View the site at <https://yhsanave.github.io/gif-picker/>

## Running

To run in developer mode: `npm run dev`

To build for production: `npm run build`

To deploy to GitHub Pages: `npm run deploy`

## Notes

There were a couple places in the app where I would have liked to do things differently, were I not limited by some restrictions in GIPHY's API terms of service.

In particular, I would have liked to reorder the gifs based on their height so the columns are closer to the same height and there is less blank space at the bottom, but GIPHY forbids reordering the results.

I initially planned to have a cache feature to reduce API calls and allow users to see all previous searches even if they hit the API limit, but this is also forbidden.

Lastly, I would have set up a proxy server to forward the requests with the API key, rather than doing it directly from the client side. Doing it from the client side exposes the API key, which in a more sensitive application could be a major security vulnerability. GIPHY's terms of service explicitly forbid this and require that all API calls be made from the client side.

Other than the limitations imposed by the GIPHY API, I would have liked to have the number of columns adjust dynamically to fit the screen size, but by the time I thought to do that it would have required rewriting a big chunk of the app and it just didn't seem worth it for such a minor benefit.

## Known Issues

In Opera GX it had flashing buttons popping up when hovering over the GIFs and I couldn't figure out how to get rid of them. This doesn't happen in Edge, Chrome, or Firefox.

When testing on mobile, I had some issues with the GIFs loading. On Firefox, only a few GIFs would load, sometimes none at all. On Chrome they loaded fine, but when scrolling the GIFs stop playing, which I assume is due to some kind of performance optimization.

## Credits

[Search](https://icons8.com/icon/112468/search) icon by [Icons8](https://icons8.com)
