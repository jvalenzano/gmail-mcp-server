import { listLabels } from '../../services/gmail/labels.js';

export const LIST_LABELS_TOOL = {
  name: "listLabels",
  description: "List all Gmail labels (system and user-created) with their IDs",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
};

export async function handleListLabels(_args: Record<string, unknown>) {
  try {
    return await listLabels();
  } catch (error) {
    console.error('Handle list labels error:', error);
    return {
      content: [{
        type: "text",
        text: `Error listing labels: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}
