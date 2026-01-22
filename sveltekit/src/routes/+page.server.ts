import type { PageServerLoad } from "./$types";
// @ts-ignore
import { MOCK_DATA } from "$env/static/public";

export const load: PageServerLoad = async () => {
  return {
    usingMockData: MOCK_DATA === "true",
  };
};
