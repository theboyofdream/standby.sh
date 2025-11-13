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
    parse: (v) => (v === "12" || v === "24" ? v : "12"),
    serialize: (v) => v,
  });

  const [theme, setTheme] = useQueryState<Theme>("theme", {
    defaultValue: "system",
    parse: (v) => (["dark", "light", "system"].includes(v) ? (v as Theme) : "system"),
    serialize: (v) => v,
  });

  const [page, setPage] = useQueryState<"clocks" | "countdown">("page", {
    defaultValue: "clocks",
    parse: (v) => (v === "clocks" || v === "countdown" ? v : "clocks"),
    serialize: (v) => v,
  });

  return {
    showSecs,
    setShowSecs,
    hrsFormat,
    setHrsFormat,
    theme,
    setTheme,
    page,
    setPage,
  };
}
