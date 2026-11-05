// A small helper for the Desuko plugin API (ADR 0041). Copy it into your own plugin.
// Messages go to the parent window (the Plugins widget); nothing else is reachable.
(() => {
  const API = 1;
  const pending = new Map();
  let nextId = 1;
  let onTheme = () => {};
  let resolveHello;
  const hello = new Promise((resolve) => {
    resolveHello = resolve;
  });

  function applyTheme(theme) {
    const root = document.documentElement;
    for (const [name, value] of Object.entries(theme.vars)) root.style.setProperty(name, value);
    root.dataset.mode = theme.mode;
    onTheme(theme);
  }

  window.addEventListener('message', (e) => {
    if (e.source !== window.parent) return;
    const msg = e.data;
    if (!msg || msg.desuko !== API) return;
    if (msg.type === 'hello') {
      applyTheme(msg.theme);
      resolveHello(msg);
    } else if (msg.type === 'theme') {
      applyTheme(msg.theme);
    } else if (msg.type === 'result') {
      const p = pending.get(msg.id);
      if (!p) return;
      pending.delete(msg.id);
      if (msg.ok) p.resolve(msg.value);
      else p.reject(new Error(msg.error));
    }
  });

  function call(body) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      window.parent.postMessage({ desuko: API, id, call: body }, '*');
    });
  }

  window.desuko = {
    ready: () => {
      window.parent.postMessage({ desuko: API, type: 'ready' }, '*');
      return hello;
    },
    onTheme: (fn) => {
      onTheme = fn;
    },
    storage: {
      get: (key) => call({ type: 'storage.get', key }),
      set: (key, value) => call({ type: 'storage.set', key, value }),
      delete: (key) => call({ type: 'storage.delete', key }),
      keys: () => call({ type: 'storage.keys' }),
    },
    chat: { draft: (text) => call({ type: 'chat.draft', text }) },
    notify: (title, body = '') => call({ type: 'notify', title, body }),
  };
})();
