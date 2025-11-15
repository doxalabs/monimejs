import type { ClientOptions } from "./types";

export class MonimeClient {
  private spaceId: string;
  private accessToken: string;

  constructor(options: ClientOptions) {
    this.accessToken = options.accessToken;
    this.spaceId = options.spaceId;
  }

  /** @internal */
  _get_client_config() {
    return {
      spaceId: this.spaceId,
      accessToken: this.accessToken,
    };
  }
}
