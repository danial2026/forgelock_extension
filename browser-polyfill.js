// Browser API polyfill
(function () {
  // Make sure we have the browser object in Firefox or the chrome object in Chrome
  window.browser = window.browser || window.chrome;

  // Ensure proper clipboard handling across browsers
  if (!navigator.clipboard && browser.runtime && browser.runtime.sendMessage) {
    navigator.clipboard = {
      writeText: function (text) {
        return new Promise((resolve, reject) => {
          // Try execCommand as a fallback
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          try {
            const successful = document.execCommand("copy");
            if (successful) {
              resolve();
            } else {
              reject(new Error("Unable to copy text to clipboard"));
            }
          } catch (err) {
            reject(err);
          }

          document.body.removeChild(textArea);
        });
      },
    };
  }
})();
