/* This Chrome extension logs all messages sent and received via the MessageChannel API to the console. */

let MessageChannelTracker = function() {
	
	// Returns the frame hierarchy of a window
	let h = function(p) {
		var hops = "";
		if (!p) {
			p = window;
		}
		if (p.top != p && p.top == window.top) {
			var w = p;
			while (top != w) { 
				var x = 0; 
				for (var i = 0; i < w.parent.frames.length; i++) { 
					if (w == w.parent.frames[i]) {
						x = i;
					}
				}
				hops = "frames[" + x + "]" + (hops.length ? "." : "") + hops;
				w = w.parent;
			}; 
			hops = "top" + (hops.length ? "." + hops : "")
		} else {
			hops = (p.top == window.top) ? "top" : "popup";
		}
		return hops;
	};
	
	// If postMessage is received with ports, save origin for later logging
	window.addEventListener("message", (e) => {
		for (let port of e.ports) {
			console.info(`%c[MessageChannelTracker]%c Transferred port from %c${h(e.source)}%c to %c${h()}%c`, "color:orange;", "", "color:red;", "", "color:green;", "");
			port.source = h(e.source);
		}
	});

	// Wrapping of "MessageChannel()"
	window._MessageChannel = window.MessageChannel;
	window.MessageChannel = function() {
		
		// Create a new MessageChannel
		// For each MessageChannel, we create an individual ID
		// This ID is used to assign the transferred messages between ports to specific channels
		var channel = new window._MessageChannel();
		var channelID = Math.floor(Math.random() * 1000);
		
		console.info(`%c[MessageChannelTracker]%c Created new MessageChannel %c#${channelID}`, "color:orange;", "", "color:red;");
		
		// Save the channelID to the MessagePorts to identify the assigned channel of the ports
		channel.port1.channelID = channelID;
		channel.port1.portID = "p1";
		channel.port2.channelID = channelID;
		channel.port2.portID = "p2";
		
		channel.port1.addEventListener("message", (event) => {
			if (event.data != null) {
				let dataString = (typeof event.data == "string") ? (event.data) : ("json " + JSON.stringify(event.data));
				let currentWindow = h();
				console.info(`%c[MessageChannelTracker]%c Received: %c${"?"}%c→%c${currentWindow}%c (%c#${event.target.channelID}%c.%c${"p2"}%c→%c#${event.target.channelID}%c.%c${"p1"}%c)\n${dataString}`, "color:orange;", "", "color: red;", "", "color: green;", "", "color: red;", "", "color: red;", "", "color: green;", "", "color: green", "");
			}
		});
		
		channel.port2.addEventListener("message", (event) => {
			if (event.data != null) {
				let dataString = (typeof event.data == "string") ? (event.data) : ("json " + JSON.stringify(event.data));
				let currentWindow = h();
				console.info(`%c[MessageChannelTracker]%c Received: %c${"?"}%c→%c${currentWindow}%c (%c#${event.target.channelID}%c.%c${"p1"}%c→%c#${event.target.channelID}%c.%c${"p2"}%c)\n${dataString}`, "color:orange;", "", "color: red;", "", "color: green;", "", "color: red;", "", "color: red;", "", "color: green;", "", "color: green", "");
			}
		});
		
		return channel;
	}

	// Wrapping of "MessagePort.postMessage()"
	MessagePort.prototype._postMessage = MessagePort.prototype.postMessage
	MessagePort.prototype.postMessage = function(message, transferList) {
		if (message != null) {
			let dataString = (typeof message == "string") ? (message) : ("json " + JSON.stringify(message));
			let currentWindow = h();
			let destPortID = undefined;
			if (this.portID) {
				destPortID = (this.portID == "p1") ? "p2" : "p1";
			}
			console.info(`%c[MessageChannelTracker]%c Sending: %c${currentWindow}%c→%c${this.source || "?"}%c (%c#${this.channelID || "?"}%c.%c${this.portID || "?"}%c→%c#${this.channelID || "?"}%c.%c${destPortID || "?"}%c)\n${dataString}`, "color:orange;", "", "color: red;", "", "color: green;", "", "color: red;", "", "color: red;", "", "color: green;", "", "color: green", "");
		}
		return this._postMessage(message, transferList);
	}

	console.info(`%c[MessageChannelTracker]%c Initialized in %c${h()}%c`, "color:orange;", "", "color:green;", "");
}

MessageChannelTracker();

//MessageChannelTracker = "(" + MessageChannelTracker.toString() + ")()";

//let script = document.createElement("script");
//script.setAttribute("type", "text/javascript");
//script.appendChild(document.createTextNode(MessageChannelTracker));
//document.documentElement.appendChild(script);
