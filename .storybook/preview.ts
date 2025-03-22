import type { Preview } from "@storybook/react";

import "@/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(?:background|color)$/i,
        date: /date$/i,
      },
    },
    layout: "centered",
  },
};

export default preview;
