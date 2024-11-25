export interface SseEvent {
  data: string;
  id?: string;
  type?: string;
  retry?: number;
}
