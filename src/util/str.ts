export interface StripInvisibleOptions {
  keepNewlines?: boolean; // keep \n
  keepTabs?: boolean; // keep \t
  keepCarriageReturn?: boolean; // keep \r
  keepVariationSelectors?: boolean; // keep U+FE00–U+FE0F (emoji variation selectors)
}

export function stripInvisible(
  input: string,
  opts: StripInvisibleOptions = {},
): string {
  const {
    keepNewlines = true,
    keepTabs = true,
    keepCarriageReturn = false,
    keepVariationSelectors = true,
  } = opts;

  const ANSI_PATTERN =
    /\x1B(?:\[[0-?]*[ -/]*[@-~]|[\]PX^_][\s\S]*?(?:\x07|\x1B\\)|[@-Z\\-_])/g;

  let s = input.replace(ANSI_PATTERN, "");

  const ZERO_WIDTH_PATTERN = /[\u200B-\u200D\u2060\uFEFF]/g;
  s = s.replace(ZERO_WIDTH_PATTERN, "");

  if (!keepVariationSelectors) {
    s = s.replace(/[\uFE00-\uFE0F]/g, "");
  }

  const toKeep: string[] = [];
  if (keepNewlines) toKeep.push("\n");
  if (keepTabs) toKeep.push("\t");
  if (keepCarriageReturn) toKeep.push("\r");

  const baseControlPattern = /[\x00-\x08\x09\x0A\x0B\x0C\x0D\x0E-\x1F\x7F]/g; // includes \t\n\r
  if (toKeep.length === 0) {
    s = s.replace(baseControlPattern, "");
  } else {
    s = s.replace(baseControlPattern, (ch) => (toKeep.includes(ch) ? ch : ""));
  }

  return s;
}
