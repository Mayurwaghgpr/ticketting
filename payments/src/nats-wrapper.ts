import nats, { Stan } from "node-nats-streaming";
class NatsWrapper {
  private _client?: Stan;
  get client() {
    if (!this._client) {
      throw new Error("cannot access NATS client before connecting");
    }
    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("NATS connected");
        resolve();
      });
      this.client.on("connect", (error) => {
        reject(error);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
