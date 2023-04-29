Since menu keys must be unique, but our path for incoming document
and outgoing document could be the same

Ex: /docin/receive and /docout/process

We need to convert theme to the menu keys so that the menu will be opened 
and selected correctly on location onchange

/docin/receive -> inReceive
/docout/receive -> outReceive

path = location.pathname.split('/').slice(1) = [, docin, receive]

We will pass location[2] inside util function only

See MenuUtils.ts