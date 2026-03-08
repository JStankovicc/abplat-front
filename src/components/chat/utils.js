/**
 * Groups consecutive messages from the same sender within 5 minutes.
 */
export const groupMessagesBySender = (messages) => {
  const grouped = [];
  let currentGroup = null;

  messages.forEach((message, index) => {
    const shouldStartNewGroup =
      !currentGroup ||
      currentGroup.senderId !== message.senderId ||
      (message.timestamp - currentGroup.lastTimestamp) > 5 * 60 * 1000;

    if (shouldStartNewGroup) {
      currentGroup = {
        senderId: message.senderId,
        sender: message.sender,
        senderAvatar: message.senderAvatar,
        messages: [message],
        firstTimestamp: message.timestamp,
        lastTimestamp: message.timestamp,
      };
      grouped.push(currentGroup);
    } else {
      currentGroup.messages.push(message);
      currentGroup.lastTimestamp = message.timestamp;
    }
  });

  return grouped;
};

export const formatTime = (date) => {
  return date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "";
};
