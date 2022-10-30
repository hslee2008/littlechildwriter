import { event } from 'vue-gtag'

export const useEvent = (eventName: string, obj: object) => {
  return event(eventName, obj)
}
