import { createLabel } from '../../services/gmail/labels.js';
import { CreateLabelArgs } from '../../types/gmail.js';

export const CREATE_LABEL_TOOL = {
  name: "createLabel",
  description: "Create a new Gmail label. Supports nested labels using '/' separator (e.g., 'House/Vendors')",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Label name. Use '/' for nesting (e.g., 'Projects/House')"
      },
      labelListVisibility: {
        type: "string",
        description: "Visibility in label list: 'labelShow', 'labelShowIfUnread', or 'labelHide'",
        enum: ["labelShow", "labelShowIfUnread", "labelHide"]
      },
      messageListVisibility: {
        type: "string",
        description: "Visibility in message list: 'show' or 'hide'",
        enum: ["show", "hide"]
      }
    },
    required: ["name"]
  }
};

export async function handleCreateLabel(args: Record<string, unknown>) {
  try {
    const typedArgs: CreateLabelArgs = {
      name: args.name as string
    };
    if (args.labelListVisibility) typedArgs.labelListVisibility = args.labelListVisibility as string;
    if (args.messageListVisibility) typedArgs.messageListVisibility = args.messageListVisibility as string;
    return await createLabel(typedArgs);
  } catch (error) {
    console.error('Handle create label error:', error);
    return {
      content: [{
        type: "text",
        text: `Error creating label: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}
