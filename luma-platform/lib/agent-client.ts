export async function callAgentTool<T>(
  agentUrl: string,
  toolName: string,
  input: unknown
): Promise<T> {
  const primary = await fetch(`${agentUrl}/${toolName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (primary.ok) {
    return (await primary.json()) as T;
  }

  const secondary = await fetch(agentUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: toolName, input }),
  });

  if (!secondary.ok) {
    throw new Error(
      `Agent call failed for tool "${toolName}" (${agentUrl}): ${primary.status} / ${secondary.status}`
    );
  }

  return (await secondary.json()) as T;
}
