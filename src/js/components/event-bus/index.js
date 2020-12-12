const eventBus = {
  list: new Map(),

  on(eventType, eventAction) {
    const { list } = this;

    // eslint-disable-next-line
    list.has(eventType) || list.set(eventType, []);
    list.get(eventType).push(eventAction);

    const unsubscribe = () => {
      const events = list.get(eventType);
      events.splice(events.indexOf(eventAction), 1);
      list.set(eventType, events);
    };

    return unsubscribe;
  },

  emit(eventType, ...args) {
    const { list } = this;

    if (!list.get(eventType)) {
      return;
    }

    list.get(eventType).forEach((clbk) => clbk(...args));
  }
};

export default eventBus;
