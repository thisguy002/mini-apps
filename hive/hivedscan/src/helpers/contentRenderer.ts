// Lazy-load steem-content-renderer from CDN to avoid require issues
let renderer: any = null;

async function getRenderer() {
  if (renderer) {
    return renderer;
  }

  // Wait for steem-content-renderer to load from CDN
  return new Promise((resolve, reject) => {
    const checkForRenderer = () => {
      const globalAny = window as any;
      if (globalAny.steemContentRenderer?.DefaultRenderer) {
        try {
          const DefaultRenderer = globalAny.steemContentRenderer.DefaultRenderer;
          renderer = new DefaultRenderer({
            baseUrl: "https://peakd.com/",
            breaks: true,
            skipSanitization: false,
            allowInsecureScriptTags: false,
            addNofollowToLinks: true,
            doNotShowImages: false,
            ipfsPrefix: "",
            assetsWidth: 640,
            assetsHeight: 480,
            imageProxyFn: (url: string) => url,
            usertagUrlFn: (account: string) => "/@" + account,
            hashtagUrlFn: (hashtag: string) => "/trending/" + hashtag,
            isLinkSafeFn: () => true,
          });
          resolve(renderer);
        } catch (error) {
          reject(error);
        }
      } else {
        // Check again after a short delay
        setTimeout(checkForRenderer, 50);
      }
    };

    checkForRenderer();
  });
}

// Export the renderer promise - consumers will need to await it
export default getRenderer();