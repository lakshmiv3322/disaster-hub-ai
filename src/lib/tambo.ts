import { z } from "zod";
import { DisasterCard } from "../components/tambo/DisasterCard";

/**

 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 * 
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 * 
 * IMPORTANT: If you have components in different directories (e.g., both ui/ and tambo/),
 * make sure all import paths are consistent. Run 'npx tambo migrate' to consolidate.
 * 
 * Read more about Tambo at https://docs.tambo.co
 */

import type { TamboComponent } from "@tambo-ai/react";


/**
 * Components Array - A collection of Tambo components to register
 * 
 * Components represent UI elements that can be generated or controlled by AI.
 * Register your custom components here to make them available to the AI.
 * 
 * Example of adding a component:
 * 
 * ```typescript
 * import { z } from "zod/v4";
 * import { CustomChart } from "../components/ui/custom-chart";
 * 
 * // Define and add your component
 * export const components: TamboComponent[] = [
 *   {
 *     name: "CustomChart",
 *     description: "Renders a custom chart with the provided data",
 *     component: CustomChart,
 *     propsSchema: z.object({
 *       data: z.array(z.number()),
 *       title: z.string().optional(),
 *     })
 *   }
 * ];
 * ```
 */
export const components: TamboComponent[] = [
  {
    name: "DisasterCard",
    description: "Shows a structured disaster survival card",
    component: DisasterCard,
    propsSchema: z.object({
      title: z.string(),
      steps: z.array(z.string()),
      supplies: z.array(z.string())
    })
  }
];


// Import your custom components that utilize the Tambo SDK
// import { CustomChart } from "../components/tambo/custom-chart";
