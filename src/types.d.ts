// types.d.ts

export type ShowSecs = boolean | null;
export type HrsFormat = "12" | "24";
export type Theme = "dark" | "light" | "system";

declare global {
  interface Window {
    myAppConfig: {
      showSecs: ShowSecs;
      hrsFormat?: HrsFormat;
      theme?: Theme;
    };
  }
}
