import { useEffect, useState } from "react";

const SOURCE_LANG = "fr";

export function useAutoTranslate(text) {
  const [translatedText, setTranslatedText] = useState(text);
  const lang = localStorage.getItem("language") || SOURCE_LANG;

  useEffect(() => {
    async function translate() {
      if (!text) return;

      if (lang === SOURCE_LANG) {
        // Pas besoin de traduire
        setTranslatedText(text);
        return;
      }

      // Appel API LibreTranslate
      try {
        const res = await fetch("https://libretranslate.de/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: SOURCE_LANG,
            target: lang,
            format: "text"
          }),
        });
        const data = await res.json();
        if (data.translatedText) {
          setTranslatedText(data.translatedText);
        } else {
          setTranslatedText(text); // fallback
        }
      } catch (e) {
        console.error("Erreur traduction:", e);
        setTranslatedText(text); // fallback
      }
    }

    translate();
  }, [text, lang]);

  return translatedText;
}
