export class EventEmitter<
  TEventMap extends { [eventName: string]: (...args: any[]) => void },
  TEvent extends keyof TEventMap = keyof TEventMap
> {
  private listeners: Map<TEvent, TEventMap[TEvent][]> = new Map();

  on<TTEvent extends TEvent>(event: TTEvent, listener: TEventMap[TTEvent]) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  emit<TTEvent extends TEvent>(
    event: TTEvent,
    ...args: Parameters<TEventMap[TTEvent]>
  ) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((listener) => listener(...args));
    }
  }

  off<TTEvent extends TEvent>(event: TTEvent, listener: TEventMap[TTEvent]) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event)!;
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

// usage
