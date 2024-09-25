import JSON5 from "json5";
import { promises as fs } from "fs";
import { InstanceConfig, instanceConfigSchema } from "./instanceConfigs";

describe("Instance configurations", () => {
  it("should be created according to a unified schema", async () => {
    const config = await fs.readFile("./public/featured-instances.json5", "utf-8");

    const parsedConfig = JSON5.parse(config);

    parsedConfig.forEach((instance: InstanceConfig) => {
      const result = instanceConfigSchema.safeParse(instance);
      if (!result.success) {
        console.error(result.error.format(), instance);
      }
      expect(result.success).toBe(true);
    });
  });
});
