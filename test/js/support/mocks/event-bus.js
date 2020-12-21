import eventBus from 'components/event-bus';

const mockEventEmit = () => {
  /* eslint-disable no-undef, no-empty-function */
  return jest.spyOn(eventBus, 'emit');
  /* eslint-enable no-undef, no-empty-function */
};

export { mockEventEmit };
