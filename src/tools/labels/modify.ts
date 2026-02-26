import { modifyMessageLabels } from '../../services/gmail/labels.js';
import { ModifyMessageLabelsArgs } from '../../types/gmail.js';

export const MODIFY_MESSAGE_LABELS_TOOL = {
  name: "modifyMessageLabels",
  description: "Add and/or remove labels from a Gmail message",
  inputSchema: {
    type: "object",
    properties: {
      messageId: {
        type: "string",
        description: "ID of the message to modify"
      },
      addLabelIds: {
        type: "array",
        items: { type: "string" },
        description: "Label IDs to add to the message"
      },
      removeLabelIds: {
        type: "array",
        items: { type: "string" },
        description: "Label IDs to remove from the message"
      }
    },
    required: ["messageId"]
  }
};

function toStringArray(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed as string[];
    } catch { /* not JSON */ }
    return [value];
  }
  return undefined;
}

export async function handleModifyMessageLabels(args: Record<string, unknown>) {
  try {
    const addLabelIds = toStringArray(args.addLabelIds);
    const removeLabelIds = toStringArray(args.removeLabelIds);

    if (!addLabelIds?.length && !removeLabelIds?.length) {
      return {
        content: [{
          type: "text",
          text: "Error: At least one of addLabelIds or removeLabelIds must be provided"
        }],
        isError: true
      };
    }

    const typedArgs: ModifyMessageLabelsArgs = {
      messageId: args.messageId as string,
      ...(addLabelIds && { addLabelIds }),
      ...(removeLabelIds && { removeLabelIds })
    };
    return await modifyMessageLabels(typedArgs);
  } catch (error) {
    console.error('Handle modify message labels error:', error);
    return {
      content: [{
        type: "text",
        text: `Error modifying message labels: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}
