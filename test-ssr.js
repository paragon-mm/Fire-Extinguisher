const document = { createElement: () => ({ getContext: () => null }) }; global.document = document; import { createServer } from 'vite';

(async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  
  try {
    const App = await vite.ssrLoadModule('/src/App.tsx');
    console.log("App module loaded:", Object.keys(App));
    
    // We can try to render it if we have react-dom/server
    const { renderToString } = await vite.ssrLoadModule('react-dom/server');
    const React = await vite.ssrLoadModule('react');
    
    const html = renderToString(React.createElement(App.default));
    console.log("Render successful, HTML length:", html.length);
  } catch (e) {
    console.error("SSR ERROR:", e);
  } finally {
    vite.close();
  }
})();
