// src/i18n/LanguageSwitcher.tsx
import { useLocale, useSetLocale } from "react-admin";
import { IconButton, Tooltip } from "@mui/material";

const LanguageSwitcher = () => {
  const locale = useLocale();
  const setLocale = useSetLocale();

  const toggleLocale = () => setLocale(locale === "vi" ? "en" : "vi");

  return (
    <Tooltip title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}>
      <IconButton onClick={toggleLocale} color="inherit" size="large">
        <span style={{ fontSize: "1.5rem" }}>
          {locale === "vi" ? "en" : "🇻🇳"}
        </span>
      </IconButton>
    </Tooltip>
  );
};

export default LanguageSwitcher;
