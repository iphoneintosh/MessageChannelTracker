# MessageChannelTracker

This Chrome extension logs all messages sent and received via the [Channel Messaging API](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) to the console. Besides postMessage logging and debugging, the Channel Messaging API may play an important role in certain web applications. With a regular postMessage logging tool, you will not see the messages that are exchanged with the Channel Messaging API. However, these messages might be as important as the messages exchanged with the postMessage API. Thus, it is highly recommended to install a Channel Messaging API logging tool to not miss any messages that are exchanged between two or more frames.

## Installation

- `git clone https://github.com/iphoneintosh/MessageChannelTracker`
- In Chrome, go to [chrome://extensions/](chrome://extensions/)
- Enable developer mode in the top right
- Load unpacked extension and select the `MessageChannelTracker` folder

## Basic Functionality

The content script contained in this extension overwrites the `MessageChannel()` constructor and `MessagePort.postMessage()` function to log all messages that are sent *and* received on MessagePorts. You can also identify the sending and receiving frame, the corresponding ports, and the MessageChannel over which the message is transferred. For instance, if there are multiple MessageChannels, you can associate the messages to the corresponding channels and reconstruct the entire communication over the Channel Messaging API.
