const {isMainThread, Worker} = require('worker_threads');

if(isMainThread) {
    console.log(`Main thread pid ${process.pid}`)
    new Worker(__filename);
    new Worker(__filename);
} else {
    console.log(`'We are in worker thread' : ${process.pid}`);
}