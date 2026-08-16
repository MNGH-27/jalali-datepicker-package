import type { Preview } from "@storybook/react";
import React from "react";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div dir="rtl" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
