export interface Co {
  exec(generator: any, callback?: () => void);
  all(cbs: any[]): any[];
}

const isObject = (val: unknown): val is object =>
  val && typeof val === "object";
const isFunction = (val: unknown): boolean => typeof val === "function";
const isGeneratorFunction = (val: unknown): boolean =>
  "[object GeneratorFunction]" === Object.prototype.toString.call(val);
const isGenerator = (val: unknown): boolean =>
  "[object Generator]" === Object.prototype.toString.call(val);

const isPromise = (val: unknown): boolean =>
  val &&
  isObject(val) &&
  isFunction((val as any).then) &&
  isFunction((val as any).catch);

class CoImpl implements Co {
  private ctx;

  poll(
    generator: Generator<never, any, unknown>,
    callback?: () => void,
    isDone: boolean = false
  ) {
    const { value, done } = generator.next(this.ctx);
    if (isGeneratorFunction(value) || isGenerator(value)) {
      this.exec(value, () => {
        this.poll(generator, null, done);
      });
    } else if (isPromise(value)) {
      const promise = value as any;
      promise.then().then((val) => {
        this.ctx = val;
        if (isDone) return;
        this.poll(generator, null, done);
        callback?.();
      });
    } else {
      this.ctx = value;
      if (isDone) return;
      this.poll(generator, null, done);
      callback?.();
    }
  }

  intoGenerator(generator: any): Generator<never, any, unknown> {
    return isFunction(generator) ? generator() : generator;
  }

  exec(generator: any, callback?: () => void) {
    if (isGeneratorFunction(generator) || isGenerator(generator)) {
      generator = this.intoGenerator(generator);
      this.poll(generator, callback);
    }
  }

  all(cbs: any[]): any[] {
    throw new Error("Method not implemented.");
  }
}

export const co = new CoImpl();
