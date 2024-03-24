import React from 'react';
import { MessageSimple, useMessageContext } from 'stream-chat-react';

const TeamMessage = () => {
    const { handleOpenThread, message } = useMessageContext();

    const openThreadHandler = () => {
        if (handleOpenThread) {
            handleOpenThread(message);
        }
    };

    return (
        <MessageSimple
            message={message}
            handleOpenThread={openThreadHandler}
        />
    );
};

export default TeamMessage;
