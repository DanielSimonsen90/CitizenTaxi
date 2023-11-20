import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

import { Promiseable } from "types";
import { API_ENDPOINT_SECURE_SIGNALR } from "utils";

import { HubActionNames, HubActions } from "./Actions/_Setup/HubActionTypes";
import { EventRegisterProps, HubEventNames, HubEvents } from "./Events/_Setup/HubEventTypes";
import Events from "./Events";

export default class NotificationHubConnection {
  private static _instance: NotificationHubConnection;
  private static _hubConnectionSecure = new HubConnectionBuilder()
    .withUrl(API_ENDPOINT_SECURE_SIGNALR)
    .withAutomaticReconnect()
    // .configureLogging(LogLevel.Information)
    .build();

  private _hubConnection: HubConnection = NotificationHubConnection._hubConnectionSecure;
  private _startUpQueue = new Array<[action: HubActionNames, ...args: any[]]>();
  public callbacks: Map<[event: string, originalHandler: Function], (...args: any[]) => void> = new Map();

  public static getInstance(): NotificationHubConnection {
    if (!NotificationHubConnection._instance) NotificationHubConnection._instance = new NotificationHubConnection();
    return NotificationHubConnection._instance;
  }

  private constructor() {
    this._hubConnection = NotificationHubConnection._hubConnectionSecure;
  }

  //#region Startup
  private connect() {
    return this._hubConnection.start()
      .then(() => this.startQueue())
      .catch(console.error);
  }
  private startQueue() {
    var interval = setInterval(async function executeSendQueue(this: NotificationHubConnection) {
      if (this._hubConnection.state !== HubConnectionState.Connected) return;

      for (const [action, ...args] of this._startUpQueue) {
        await this.send(action, ...args as any);
      }
      this._startUpQueue.length = 0;
      clearInterval(interval);
    }.bind(this), 100);

    setTimeout(() => {
      if (this._startUpQueue.length) this.connect();
    }, 1000);
  }
  //#endregion

  public get connectionId() {
    return this._hubConnection.connectionId;
  }

  //#region Events
  public on<
    EventName extends HubEventNames,
    Arguments extends HubEvents[EventName]
  >(event: EventName, callback: (...args: Arguments) => Promiseable<void>) {
    const _callback = (...args: any[]) => {
      // console.log(`Received ${event} event`, args);
      callback(...args as Arguments);
    };
    this._hubConnection.on(event, _callback);
    this.callbacks.set([event, callback], _callback);
  };

  public async send<
    Action extends HubActionNames,
    Arguments extends HubActions[Action]
  >(action: Action, ...args: Arguments) {
    if (this._hubConnection.state !== HubConnectionState.Connected || !this.connectionId) {
      this._startUpQueue.push([action, ...args]);
      return this.startQueue();
    }
    // console.log(`Sending ${action} action`, args);
    return this._hubConnection.send(action as string, ...args);
  };

  public off<
    EventName extends HubEventNames,
    Arguments extends HubEvents[EventName]
  >(event: EventName, callback: (...args: Arguments) => Promiseable<void>) {
    const _callback = this.callbacks.get([event, callback]);
    if (!_callback) return console.warn(`Callback for ${event} event not found`);
    // console.log(`Removing ${event} event callback`);

    this._hubConnection.off(event as string, _callback);
  }

  public clear(events: Array<string>) {
    this.callbacks.forEach((callback, [event]) => {
      if (!events.includes(event)) return;
      this._hubConnection.off(event, callback);
    });

    this.callbacks = this.callbacks.filter((_, [event]) => !events.includes(event));
  }
  //#endregion

  //#region Register site events
  public reigster<
    EventNames extends HubEventNames,
    Events extends HubEvents,
  >(
    events: Record<EventNames, EventRegisterProps<HubEventNames>>,
    callback: <EventName extends EventNames>(
      event: EventName,
      ...args: Events[EventName]
    ) => ReturnType<NotificationHubConnection['on']>
  ) {
    if (this.callbacks.keyArr().some(([event]) => event in events)) {
      this.clear(Object.keys(events));
    }

    Object.keysOf(Events).forEach((event) => {
      if (!(event in events)) return;

      const _callback = <EventName extends EventNames>(...args: Events[EventName]) => callback(event as EventName, ...args);
      this.on(event, _callback);
    });

    // console.log('Registered events', this.callbacks.keyArr().map(([event]) => event));
  }
  //#endregion
}

export type NotificationHubConnectionType = NotificationHubConnection;