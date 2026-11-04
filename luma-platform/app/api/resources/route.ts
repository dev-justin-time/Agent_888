import { NextRequest } from "next/server";
import { ResourceNeedSchema } from "@/lib/validation";
import { invalid, runRoute, success } from "@/lib/api";
import { ASSISTANCE_MESSAGE, HOTLINE_MESSAGE, getGrants, getHotline } from "@/lib/resources";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const parsed = ResourceNeedSchema.safeParse({
    locale: searchParams.get("locale") ?? undefined,
    need: searchParams.get("need") ?? undefined,
  });

  if (!parsed.success) return invalid(parsed);

  const locale = (parsed.data.locale ?? "US").toUpperCase();
  const need = parsed.data.need ?? "community";

  return runRoute(
    "Resources API error",
    async () => {
      if (need === "hotline") {
        return success({
          type: "hotline",
          data: await getHotline(locale),
          message: HOTLINE_MESSAGE,
        });
      }

      return success({
        type: need,
        data: await getGrants(need, locale),
        message: ASSISTANCE_MESSAGE,
      });
    },
    "Resources are temporarily unavailable.",
    503
  );
}
