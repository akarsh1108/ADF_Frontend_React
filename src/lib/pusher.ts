import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1879605",
  key: "aeeb90d987e5e72bddbe",
  secret: "543074e9650b9560798e",
  cluster: "ap2",
  useTLS: true,
});

// module.exports = pusherServer;

export const pusherClient = new PusherClient("aeeb90d987e5e72bddbe", {
  cluster: "ap2",
  channelAuthorization: {
    endpoint: "/api/pusher/auth",
    transport: "ajax",
    params: {
      pipeline: "4",
    },
  },
});
