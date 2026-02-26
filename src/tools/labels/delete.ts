import { deleteLabel } from '../../services/gmail/labels.js';
import { DeleteLabelArgs } from '../../types/gmail.js';

export const DELETE_LABEL_TOOL = {
  name: "deleteLabel",
  description: "Delete a user-created Gmail label by ID",
  inputSchema: {
    type: "object",
    properties: {
      labelId: {
        type: "string",
        description: "ID of the label to delete"
      }
    },
    required: ["labelId"]
  }
};

export async function handleDeleteLabel(args: Record<string, unknown>) {
  try {
    const typedArgs: DeleteLabelArgs = {
      labelId: args.labelId as string
    };
    return await deleteLabel(typedArgs);
  } catch (error) {
    console.error('Handle delete label error:', error);
    return {
      content: [{
        type: "text",
        text: `Error deleting label: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}
