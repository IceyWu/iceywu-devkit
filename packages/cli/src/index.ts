#!/usr/bin/env node

import { createCliApp } from "./app.js";

await createCliApp().parseAsync(process.argv);
