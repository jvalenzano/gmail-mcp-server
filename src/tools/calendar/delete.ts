import { deleteEvent } from '../../services/calendar/events.js';

export const DELETE_EVENT_TOOL = {
  name: "deleteEvent",
  description: "Delete a calendar event",
  inputSchema: {
    type: "object",
    properties: {
      eventId: {
        type: "string",
        description: "ID of the event to delete"
      },
      sendNotifications: {
        type: "boolean",
        description: "Whether to send cancellation notifications to attendees (default: true)"
      }
    },
    required: ["eventId"]
  }
};

export async function handleDeleteEvent(args: Record<string, unknown>) {
  const { eventId, sendNotifications } = args;
  if (typeof eventId !== 'string') {
    throw new Error('eventId is required and must be a string');
  }
  return await deleteEvent({ 
    eventId, 
    sendNotifications: typeof sendNotifications === 'boolean' ? sendNotifications : undefined 
  });
}
