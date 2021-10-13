export const smoothScroll = () => {
  const scrollValue =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollValue <= 0) return;

  window.requestAnimationFrame(smoothScroll);
  window.scrollTo(0, scrollValue - scrollValue / 8);
};
