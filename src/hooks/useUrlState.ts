import type { HrsFormat, ShowSecs, Theme } from "@/types";
import { useQueryState } from "nuqs";

export function useUrlState() {
  const [showSecs, setShowSecs] = useQueryState<ShowSecs>("showSecs", {
    defaultValue: false,
    parse: (v) => (v === "true" ? true : v === "false" ? false : null),
    serialize: (v) => (v === true ? "true" : v === false ? "false" : "null"),
  });

  const [hrsFormat, setHrsFormat] = useQueryState<HrsFormat>("hrsFormat", {
    defaultValue: "12",
  });

  const [theme, setTheme] = useQueryState<Theme>("theme", {
    defaultValue: "system",
  });

  return {
    showSecs,
    setShowSecs,
    hrsFormat,
    setHrsFormat,
    theme,
    setTheme,
  };
}
