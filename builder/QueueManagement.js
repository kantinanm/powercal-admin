const Queue = require('bee-queue');
require('dotenv').config();

const options = {
    removeOnSuccess: true,
    redis: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        password: process.env.DB_PASS,
    },
}

const calQueue = new Queue('calculate-power', options);

const placeOrder = (order) => {
    return calQueue.createJob(order).save();
};

calQueue.process(3, (job, done) => {
    setTimeout(() => console.log("Getting the ingredients ready"), 1000);
    setTimeout(() => console.log(`Preparing ${job.data.dish}`), 1500);
    setTimeout(() => {
        console.log(`Order ${job.data.orderNo}: ${job.data.dish} ready`);
        done();
    }, job.data.qty * 5000);
});

calQueue.on('succeeded', (job, result) => {
    console.log("Finish"+job.data);
});

module.exports.placeOrder = placeOrder;