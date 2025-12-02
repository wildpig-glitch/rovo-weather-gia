import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const enLocale = JSON.parse(readFileSync(join(__dirname, './locales/en.json'), 'utf-8'));
const esLocale = JSON.parse(readFileSync(join(__dirname, './locales/es.json'), 'utf-8'));
const frLocale = JSON.parse(readFileSync(join(__dirname, './locales/fr.json'), 'utf-8'));
const deLocale = JSON.parse(readFileSync(join(__dirname, './locales/de.json'), 'utf-8'));

const locales = {
  en: enLocale,
  es: esLocale,
  fr: frLocale,
  de: deLocale
};

const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = Object.keys(locales);

/**
 * Load a specific locale
 * @param {string} language - The language code (en, es, fr, de)
 * @returns {Object} The locale object
 */
export function loadLocale(language) {
  const lang = language?.toLowerCase() || DEFAULT_LANGUAGE;
  return locales[lang] || locales[DEFAULT_LANGUAGE];
}

/**
 * Get supported languages
 * @returns {Array} Array of supported language codes
 */
export function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

/**
 * Translate a clothing term
 * @param {string} key - The term key to translate
 * @param {string} language - The language code
 * @returns {string} The translated term or the key if not found
 */
export function translateTerm(key, language) {
  const locale = loadLocale(language);
  return locale.clothing_terms[key] || key;
}

/**
 * Translate a special message
 * @param {string} key - The message key to translate
 * @param {string} language - The language code
 * @returns {string} The translated message or empty string if not found
 */
export function translateMessage(key, language) {
  const locale = loadLocale(language);
  return locale.special_messages[key] || '';
}

/**
 * Validate language code
 * @param {string} language - The language code to validate
 * @returns {boolean} True if the language is supported
 */
export function isValidLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language?.toLowerCase());
}

/**
 * Get language display name
 * @param {string} language - The language code
 * @returns {string} The display name of the language
 */
export function getLanguageName(language) {
  const names = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  };
  return names[language?.toLowerCase()] || 'Unknown';
}
