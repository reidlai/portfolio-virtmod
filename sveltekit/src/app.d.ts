// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface Locals {}
    interface PageData {
      usingMockData: boolean;
      summary?: any; // Using any or specific type if available globally
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
