import { NextRequest } from "next/server";
import { ProviderConnectSchema } from "@/lib/validation";
import { fail, parseBody, runRoute, success } from "@/lib/api";
import {
  NO_PROVIDER_MESSAGE,
  findProviderConnection,
  getVerifiedProviders,
} from "@/lib/providers";

export async function GET() {
  return runRoute(
    "Providers API error",
    async () => {
      return success({
        data: await getVerifiedProviders(),
        message: "Verified provider directory.",
      });
    },
    "Provider directory is currently unavailable.",
    503
  );
}

export async function POST(req: NextRequest) {
  const body = await parseBody(req, ProviderConnectSchema);
  if ("response" in body) return body.response;

  const userLocale = body.data.user_locale.toUpperCase();
  const providerType = body.data.provider_type;

  return runRoute(
    "Provider connection error",
    async () => {
      const connection = await findProviderConnection(providerType, userLocale);
      if (!connection) return fail(NO_PROVIDER_MESSAGE, 500);

      return success(connection);
    },
    "Could not connect to a provider right now.",
    503
  );
}
