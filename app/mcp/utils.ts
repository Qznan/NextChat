import { useAppConfig } from "../store/config";
import { isMcpEnabled } from "./actions";

export function isMcpJson(content: string) {
  return content.match(/```json:mcp:([^{\s]+)([\s\S]*?)```/);
}

export function extractMcpJson(content: string) {
  const match = content.match(/```json:mcp:([^{\s]+)([\s\S]*?)```/);
  if (match && match.length === 3) {
    return { clientId: match[1], mcp: JSON.parse(match[2]) };
  }
  return null;
}

/**
 * Whether MCP is effectively enabled.
 *
 * MCP is only active when BOTH conditions are true:
 *  1. The user has turned on the client-side `enableMcp` toggle in global settings.
 *  2. The server is deployed with `ENABLE_MCP=true`.
 *
 * The client toggle is checked synchronously first so that turning MCP off in
 * settings short-circuits without hitting the server action.
 */
export async function isMcpEnabledClient(): Promise<boolean> {
  const clientEnabled = useAppConfig.getState().enableMcp;
  if (!clientEnabled) return false;
  try {
    return await isMcpEnabled();
  } catch {
    return false;
  }
}
