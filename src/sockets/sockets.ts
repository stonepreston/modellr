
export const send = (socket: WebSocket, id: string, event: string, data: Object = {}) => {

    socket.send(JSON.stringify({
        id: id,
        event: event,
        data: data
    }));

}