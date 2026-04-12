import { createI18n } from "vue-i18n";

// Vite's way of importing multiple files (replaces require.context)
const localeFiles = import.meta.glob("../../translations/locales/*.json", { eager: true });

function loadLocaleMessages() {
  const messages = {};
  for (const path in localeFiles) {
    const matched = path.match(/([A-Za-z0-9-_]+)\.json$/i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = localeFiles[path].default || localeFiles[path];
    }
  }
  return messages;
}

export const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: loadLocaleMessages()
});