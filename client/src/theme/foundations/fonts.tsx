import { Global, css } from '@emotion/react'

export const font = {
  heading: `Vesterbro, sans-serif`,
  body: `Vesterbro, sans-serif`,
}

export const Fonts = () => (
  <Global
    styles={css`
/* latin */
@font-face {
font-family: Vesterbro;
font-weight: 400;
src: url('assets/fonts/Vesterbro/try-vesterbro.otf') format('opentype');
}

/* latin */
@font-face {
font-family: Vesterbro;
font-weight: 500;
src: url('assets/fonts/Vesterbro/TRYVesterbro-Bold.otf') format('opentype');
}

/* latin */
@font-face {
font-family: Vesterbro;
font-weight: 600;
src: url('assets/fonts/Vesterbro/TRYVesterbro-Extrabold.otf') format('opentype');
}
    /* latin */
@font-face {
font-family: Jakarta;
font-style: normal;
font-weight: 400;
font-display: swap;
src: url('assets/fonts/Jakarta/PlusJakartaSans-Light.woff2') format('woff2'), url('assets/fonts/Jakarta/PlusJakartaSans-Light.woff') format('woff');
unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
/* latin */
@font-face {
font-family: Jakarta;
font-style: normal;
font-weight: 700;
font-display: swap;
src: url('assets/fonts/Jakarta/PlusJakartaSans-Bold.woff2') format('woff2'), url('assets/fonts/Jakarta/PlusJakartaSans-Bold.woff2') format('woff');
unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;    /* latin */
@font-face {
font-family: Jakarta;
font-style: normal;
font-weight: 800;
font-display: swap;
src: url('assets/fonts/Jakarta/PlusJakartaSans-ExtraBold.woff2') format('woff2'), url('assets/fonts/Jakarta/PlusJakartaSans-ExtraBold.woff') format('woff');
unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
`}
  />
)
