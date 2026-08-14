export interface Attribution {
  name: string;
  URL?: string;
}

export interface RemixEntry {
  description?: string;
  attribution?: Attribution[];
  collectivelyAttributedSince?: number;
  code?: {
    label?: string;
    URL?: string;
  }[];
}

/**
 * Creates a plain-text attribution that can be embedded in an
 * OpenProcessing sketch.
 */
export function generateExampleAttribution(
  title: string,
  remixData?: RemixEntry[]
): string {
  const lines: string[] = [];

  lines.push(title);
  lines.push("");

  remixData?.forEach((item) => {
    if (item.collectivelyAttributedSince || !item.attribution?.length) {
      return;
    }

    const description = item.description ?? "Based on";

    const authors = item.attribution
      .map((author) =>
        author.URL ? `${author.name} (${author.URL})` : author.name
      )
      .join(", ");

    lines.push(`${description}: ${authors}`);
  });

  const collectiveYear = remixData?.reduce<number | undefined>(
    (year, item) => item.collectivelyAttributedSince ?? year,
    undefined
  );

  if (collectiveYear) {
    lines.push(
      `From ${collectiveYear} onwards, edited and maintained by p5.js Contributors and Processing Foundation.`
    );
  } else {
    lines.push(
      "Edited and maintained by p5.js Contributors and Processing Foundation."
    );
  }

  lines.push("Licensed under CC BY-NC-SA 4.0.");

  return lines.join("\n");
}

/**
 * Adds attribution as JavaScript comments above the sketch code.
 */
export function addAttributionToCode(
  code: string,
  title: string,
  remixData?: RemixEntry[]
): string {
  const attribution = generateExampleAttribution(title, remixData);

  const comment = attribution
    .split("\n")
    .map((line) => `// ${line}`)
    .join("\n");

  return `${comment}\n\n${code}`;
}