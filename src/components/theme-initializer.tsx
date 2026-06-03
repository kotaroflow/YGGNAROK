const script = `
(function() {
  try {
    var theme = document.cookie.match(/(?:^|; )ygn-theme=([^;]*)/);
    var value = theme ? decodeURIComponent(theme[1]) : null;
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch(e) {}
})();
`;

export function ThemeInitializer() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
