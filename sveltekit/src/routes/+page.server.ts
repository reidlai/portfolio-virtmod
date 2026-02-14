import type { PageServerLoad } from "./$types";
// @ts-ignore
import { env } from "$env/dynamic/public";

export const load: PageServerLoad = async () => {
  return {
    usingMockData: env.PUBLIC_MOCK_DATA === "true",
  };
};
