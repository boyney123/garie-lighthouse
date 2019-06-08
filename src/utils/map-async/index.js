module.exports = function mapAsync(iterable, mapper, options = {}) {
    const { concurrency = 1 } = options;

    function waitTillAllFinished(promises) {
        return Promise.all(promises.map(t => new Promise(resolve => t.then(resolve, resolve))));
    }

    async function waitTillOneFinished(promises) {
        const indexToRemove = await Promise.race(promises.map((p, i) => new Promise(resolve => {
            return p.then(() => resolve(i), () => resolve(i));
        })));
        return promises.filter((p, i) => i !== indexToRemove);
    }

    const it = iterable[Symbol.iterator]();

    async function nextTick(running = []) {
        const item = it.next();
        if (item.done) {
            return waitTillAllFinished(running);
        }
        if (running.length === concurrency) {
            const nextrunning = await waitTillOneFinished(running);
            running = nextrunning;
        }
        const eventually = mapper(item.value);
        running.push(eventually);
        return nextTick(running);
    }

    return nextTick();
};
