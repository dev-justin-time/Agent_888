declare module "@blocks-network/sdk" {
  export interface AgentConfig {
    name: string;
    description: string;
    pricing?: {
      type: string;
      amount: number;
      currency: string;
    };
  }

  export interface Tool {
    name: string;
    description: string;
    handler: (input: any) => Promise<any>;
  }

  export class Agent {
    constructor(config: AgentConfig);
    registerTool(tool: Tool): void;
    start(config: { port: number }): void;
  }
}
