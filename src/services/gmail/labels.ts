import { gmail } from '../../config/auth.js';
import { CreateLabelArgs, DeleteLabelArgs, ModifyMessageLabelsArgs, MessageResponse } from '../../types/gmail.js';

export async function listLabels(): Promise<MessageResponse> {
  try {
    const response = await gmail.users.labels.list({
      userId: 'me'
    });

    const labels = response.data.labels || [];

    const systemLabels = labels
      .filter(l => l.type === 'system')
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(l => `  ${l.name} (${l.id})`)
      .join('\n');

    const userLabels = labels
      .filter(l => l.type === 'user')
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .map(l => `  ${l.name} (${l.id})`)
      .join('\n');

    const text = [
      `System Labels:\n${systemLabels || '  (none)'}`,
      `\nUser Labels:\n${userLabels || '  (none)'}`
    ].join('\n');

    return {
      content: [{ type: "text", text }]
    };
  } catch (error) {
    console.error('List labels error:', error);
    throw error;
  }
}

export async function createLabel({ name, labelListVisibility, messageListVisibility }: CreateLabelArgs): Promise<MessageResponse> {
  try {
    const response = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name,
        ...(labelListVisibility && { labelListVisibility }),
        ...(messageListVisibility && { messageListVisibility })
      }
    });

    return {
      content: [{
        type: "text",
        text: `Label created successfully. Name: ${response.data.name}, ID: ${response.data.id}`
      }]
    };
  } catch (error) {
    console.error('Create label error:', error);
    throw error;
  }
}

export async function deleteLabel({ labelId }: DeleteLabelArgs): Promise<MessageResponse> {
  try {
    await gmail.users.labels.delete({
      userId: 'me',
      id: labelId
    });

    return {
      content: [{
        type: "text",
        text: `Label ${labelId} deleted successfully`
      }]
    };
  } catch (error) {
    console.error('Delete label error:', error);
    throw error;
  }
}

export async function modifyMessageLabels({ messageId, addLabelIds, removeLabelIds }: ModifyMessageLabelsArgs): Promise<MessageResponse> {
  try {
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        ...(addLabelIds?.length && { addLabelIds }),
        ...(removeLabelIds?.length && { removeLabelIds })
      }
    });

    const actions: string[] = [];
    if (addLabelIds?.length) actions.push(`added: ${addLabelIds.join(', ')}`);
    if (removeLabelIds?.length) actions.push(`removed: ${removeLabelIds.join(', ')}`);

    return {
      content: [{
        type: "text",
        text: `Message ${messageId} labels updated (${actions.join('; ')})`
      }]
    };
  } catch (error) {
    console.error('Modify message labels error:', error);
    throw error;
  }
}
