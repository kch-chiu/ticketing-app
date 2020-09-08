import { Subjects, Publisher, OrderCancelledEvent } from "@kchiu-dev/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
