// Prevent Cypress from clearing localStorage between tests
const LOCAL_STORAGE_MEMORY = {};

Cypress.LocalStorage.clear = function (keys, ls, rs) {
  if (keys === null) {
    return;
  }
  for (let key in LOCAL_STORAGE_MEMORY) {
    if (keys.includes(key)) {
      continue;
    }
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  }
};

// Preserve localStorage between tests
Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage.getItem(key);
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
