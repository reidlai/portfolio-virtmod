declare module "$lib/components/ui/card" {
  export const Root: any;
  export const Header: any;
  export const Title: any;
  export const Description: any;
  export const Content: any;
  export const Footer: any;
}

declare module "@ui/card" {
  export const Root: any;
  export const Header: any;
  export const Title: any;
  export const Description: any;
  export const Content: any;
  export const Footer: any;
}

declare module "$app/navigation" {
  export const goto: (url: string | URL, opts?: any) => Promise<void>;
  export const invalidate: (
    url: string | URL | ((url: URL) => boolean),
  ) => Promise<void>;
  export const invalidateAll: () => Promise<void>;
  export const preloadData: (url: string | URL) => Promise<void>;
  export const preloadCode: (url: string | URL) => Promise<void>;
  export const beforeNavigate: (fn: (navigation: any) => void) => void;
  export const afterNavigate: (fn: (navigation: any) => void) => void;
  export const disableScrollHandling: () => void;
}

// Generic declaration for all .svelte files
// The default export is a Svelte component
// Named exports from <script module> blocks (like Props interfaces) are preserved by the Svelte compiler
declare module "*.svelte" {
  import type { Component, ComponentProps } from "svelte";
  const component: Component<any>;
  export default component;
}
