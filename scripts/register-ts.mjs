// Registers the extensionless-TS resolve hook so Node can import the project's
// `.ts` seed modules from scripts. Use via: node --import ./scripts/register-ts.mjs <script>
import { register } from "node:module";

register("./ts-extensions-loader.mjs", import.meta.url);
