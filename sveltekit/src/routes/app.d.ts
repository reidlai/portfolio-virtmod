/// <reference types="@sveltejs/kit" />
/// <reference types="@testing-library/jest-dom" />

declare module "$app/navigation" {
  export function goto(url: string, opts?: any): Promise<void>;
}
