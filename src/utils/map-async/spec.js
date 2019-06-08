const doAsync = require('.');

describe('doASync', () => {
  it('executes one task after another', async () => {
    const mapperSpy = jest.fn(function mapper(item) {
      return item();
    });

    let resolve0, resolve1, resolve2;

    const task0 = () => new Promise(resolve => {
      resolve0 = resolve;
    });
    const task1 = () => new Promise(resolve => {
      resolve1 = resolve;
    });
    const task2 = () => new Promise(resolve => {
      resolve2 = resolve;
    });

    const items = [
      task0,
      task1,
      task2,
    ];

    const wait = doAsync(items, mapperSpy, { concurrency: 1 });
    await sleep(10);

    expect(mapperSpy).toHaveBeenCalledTimes(1);
    expect(mapperSpy).toHaveBeenLastCalledWith(task0);
    resolve0();

    await sleep(10);
    expect(mapperSpy).toHaveBeenCalledTimes(2);
    expect(mapperSpy).toHaveBeenLastCalledWith(task1);
    resolve1();

    await sleep(10);
    expect(mapperSpy).toHaveBeenCalledTimes(3);
    expect(mapperSpy).toHaveBeenLastCalledWith(task2);
    resolve2();

    return wait;
  });

  it('executes two tasks concurrently', async () => {
    expect.assertions(7);

    const mapperSpy = jest.fn(function mapper(task) {
      return task();
    });

    const resolvers = [];

    //
    // 0: x x x x
    // 1: x x
    // 2:     x x x x x x
    // 3:         x
    // 4:           x x
    const task0 = () => new Promise(resolve => {
      resolvers[0] = resolve;
    });
    const task1 = () => new Promise(resolve => {
      resolvers[1] = resolve;
    });
    const task2 = () => new Promise(resolve => {
      resolvers[2] = resolve;
    });
    const task3 = () => new Promise(resolve => {
      resolvers[3] = resolve;
    });
    const task4 = () => new Promise(resolve => {
      resolvers[4] = resolve;
    });

    const tasks = {
      [Symbol.iterator]: function* () {

        expect(mapperSpy).toHaveBeenCalledTimes(0);
        yield task0;

        expect(mapperSpy).toHaveBeenCalledTimes(1);
        expect(mapperSpy).toHaveBeenCalledWith(task0);
        yield task1;

        expect(mapperSpy).toHaveBeenCalledTimes(2);
        expect(mapperSpy).toHaveBeenCalledWith(task1);
        yield task2;

        expect(mapperSpy).toHaveBeenCalledTimes(3);
        yield task3;

        expect(mapperSpy).toHaveBeenCalledTimes(4);
        yield task4;
      }
    };

    const wait = doAsync(tasks, mapperSpy, { concurrency: 2 });

    setTimeout(() => resolvers[1](), 0);
    setTimeout(() => resolvers[0](), 10);
    setTimeout(() => resolvers[3](), 20);
    setTimeout(() => resolvers[2](), 30);
    setTimeout(() => resolvers[4](), 40);

    return wait;
  });

  it('executes all tasks concurrently', async () => {
    expect.assertions(12);

    const mapperSpy = jest.fn(function mapper(task) {
      return task();
    });

    const resolvers = [];

    const task0 = () => new Promise(resolve => {
      resolvers[0] = resolve;
    });
    const task1 = () => new Promise(resolve => {
      resolvers[1] = resolve;
    });
    const task2 = () => new Promise(resolve => {
      resolvers[2] = resolve;
    });
    const task3 = () => new Promise(resolve => {
      resolvers[3] = resolve;
    });
    const task4 = () => new Promise(resolve => {
      resolvers[4] = resolve;
    });

    const tasks = {
      [Symbol.iterator]: function* () {

        expect(mapperSpy).toHaveBeenCalledTimes(0);
        yield task0;

        expect(mapperSpy).toHaveBeenCalledTimes(1);
        expect(mapperSpy).toHaveBeenCalledWith(task0);
        yield task1;

        expect(mapperSpy).toHaveBeenCalledTimes(2);
        expect(mapperSpy).toHaveBeenCalledWith(task1);
        yield task2;

        expect(mapperSpy).toHaveBeenCalledTimes(3);
        yield task3;

        expect(mapperSpy).toHaveBeenCalledTimes(4);
        yield task4;
      }
    };

    const wait = doAsync(tasks, mapperSpy, { concurrency: 5 });

    expect(resolvers[0]).toBeDefined();
    expect(resolvers[1]).toBeDefined();
    expect(resolvers[2]).toBeDefined();
    expect(resolvers[3]).toBeDefined();
    expect(resolvers[4]).toBeDefined();
    resolvers.forEach(fn => fn());

    return wait;
  });

  it('keeps executing other tasks when one throws', async () => {
    const mapperSpy = jest.fn(function mapper(item) {
      return item();
    });

    let reject0, reject1, reject2;

    const task0 = () => new Promise((resolve, reject) => {
      reject0 = reject;
    });
    const task1 = () => new Promise((resolve, reject) => {
      reject1 = reject;
    });
    const task2 = () => new Promise((resolve, reject) => {
      reject2 = reject;
    });

    const items = [
      task0,
      task1,
      task2,
    ];

    const wait = doAsync(items, mapperSpy, { concurrency: 1 });
    await sleep(10);

    expect(mapperSpy).toHaveBeenCalledTimes(1);
    expect(mapperSpy).toHaveBeenLastCalledWith(task0);
    reject0();

    await sleep(10);
    expect(mapperSpy).toHaveBeenCalledTimes(2);
    expect(mapperSpy).toHaveBeenLastCalledWith(task1);
    reject1();

    await sleep(10);
    expect(mapperSpy).toHaveBeenCalledTimes(3);
    expect(mapperSpy).toHaveBeenLastCalledWith(task2);
    reject2();

    return wait;
  });

  function sleep(delay = 0) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
});
