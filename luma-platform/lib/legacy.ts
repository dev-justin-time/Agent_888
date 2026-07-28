import fs from "fs";
import path from "path";

const VALID_SECTIONS = ["navigate", "resources", "community", "stewardship"];

export interface LegacyPage {
  content: string;
  title: string;
}

export function readLegacyHtml(section: string, variant: string): LegacyPage {
  if (!VALID_SECTIONS.includes(section)) {
    throw new Error(`Invalid legacy section: ${section}`);
  }

  const fileName = `${section}_${variant.replace(/-/g, "_")}.html`;
  const filePath = path.join(process.cwd(), "archive", "html-source", fileName);

  const html = fs.readFileSync(filePath, "utf8");

  const mainMatch = html.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  const content = mainMatch
    ? mainMatch[1]
    : html.replace(/.*?<body[^>]*>/i, "").replace(/<\/body>.*/i, "");

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);

  return {
    content,
    title: titleMatch?.[1].trim() || "LumaNation",
  };
}

export function listLegacyVariants(section?: string) {
  const dir = path.join(process.cwd(), "archive", "html-source");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));

  return files
    .map((file) => {
      const [sec, ...variantParts] = file.replace(/\.html$/, "").split("_");
      const variant = variantParts.join("-");
      return { section: sec, variant, file };
    })
    .filter((item) => (section ? item.section === section : true));
}
