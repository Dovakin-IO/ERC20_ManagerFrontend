import io from 'socket.io-client';

const socket = io.connect('http://localhost:8080/monitor');

function subscribe(cb) {
    socket.on('monitor', proto => cb(null, proto));
}

export {subscribe};