declare module "$app/navigation" {
  export function goto(url: string | URL, opts?: any): Promise<void>;
}

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

declare module "@core/types" {
  export interface IModuleBundle {
    id: string;
    routes: Array<{ path: string; component: any }>;
    widgets: Array<{
      id: string;
      title: string;
      component: any;
      location: string;
      size: string;
    }>;
  }
}
