// import {
//   Chat,
//   Channel,
//   ChannelList,
//   Window,
//   ChannelHeader,
//   MessageList,
//   MessageInput,
//   Thread,
//   useCreateChatClient,
// } from "stream-chat-react";
// import "stream-chat-react/dist/css/v2/index.css";

// const apiKey = "f5g6hxyeb5ae";
// const userId = "1";
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9.S_o4GK1Bm86CyqP5nZn-K17wCw1uwAbzl0ihZEZPAqY";

// const filters = { members: { $in: [userId] }, type: "messaging" };
// const options = { presence: true, state: true };
// const sort = { last_message_at: -1 };

// const Hello = () => {
//   const client = useCreateChatClient({
//     apiKey,
//     tokenOrProvider: token,
//     userData: { id: userId },
//   });

//   if (!client) return <div>Loading...</div>;

//   return (
//     <Chat client={client}>
//       <ChannelList sort={sort} filters={filters} options={options} />
//       <Channel>
//         <Window>
//           <ChannelHeader />
//           <MessageList />
//           <MessageInput />
//         </Window>
//         <Thread />
//       </Channel>
//     </Chat>
//   );
// };

// export default Hello;


import { StreamChat, User } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';

const userId = 'silent-base-3';
const userName = 'silent-base-3';

const user = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
};

const apiKey = 'f5g6hxyeb5ae';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic2lsZW50LWJhc2UtMyJ9.10wV6_Oms6foL25Lq6XFbOuxKliej1qUZlIxGdDcxiw';

const chatClient = new StreamChat(apiKey);
chatClient.connectUser(user, userToken);

const channel = chatClient.channel('messaging', 'custom_channel_id', {
  // add as many custom fields as you'd like
  image: 'https://www.drupal.org/files/project-images/react.png',
  name: 'Talk about React',
  members: [userId],
});

const Hello = () => (
  <Chat client={chatClient} theme='str-chat__theme-light'>
    <Channel channel={channel}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </Channel>
  </Chat>
);

export default Hello;
