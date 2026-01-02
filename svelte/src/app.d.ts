declare module "$app/navigation" {
  export function goto(
    url: string | URL,
    opts?: {
      replaceState?: boolean;
      noScroll?: boolean;
      keepFocus?: boolean;
      state?: any;
      invalidateAll?: boolean;
    },
  ): Promise<void>;
  export function invalidate(
    url: string | URL | ((url: URL) => boolean),
  ): Promise<void>;
  export function invalidateAll(): Promise<void>;
  export function preloadData(url: string | URL): Promise<void>;
  export function preloadCode(url: string | URL): Promise<void>;
  export function beforeNavigate(callback: (navigation: any) => void): void;
  export function afterNavigate(callback: (navigation: any) => void): void;
}

declare module "$app/stores" {
  import { Readable } from "svelte/store";
  export const page: Readable<any>;
  export const navigating: Readable<any>;
  export const updated: Readable<boolean>;
  export function getStores(): {
    page: Readable<any>;
    navigating: Readable<any>;
    updated: Readable<boolean>;
  };
}

declare module "$app/environment" {
  export const browser: boolean;
  export const dev: boolean;
  export const building: boolean;
  export const version: string;
}
