export class EventEmitter<
  TEventMap extends { [type: string]: (...args: any[]) => void }
> {
  private listeners: Map<keyof TEventMap, TEventMap[keyof TEventMap][]> =
    new Map();

  on<TType extends keyof TEventMap>(type: TType, listener: TEventMap[TType]) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }

    this.listeners.get(type)!.push(listener);
  }

  emit<TType extends keyof TEventMap>(
    type: TType,
    ...args: Parameters<TEventMap[TType]>
  ) {
    if (this.listeners.has(type)) {
      this.listeners.get(type)!.forEach((listener) => listener(...args));
    }
  }

  off<TType extends keyof TEventMap>(type: TType, listener: TEventMap[TType]) {
    if (this.listeners.has(type)) {
      const listeners = this.listeners.get(type)!;
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}
