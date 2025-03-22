import type { Meta, StoryObj } from "@storybook/react";

import { fn } from "@storybook/test";

import { Button, sizes, variants } from ".";

const meta = {
  args: { children: "Button", onClick: fn() },
  argTypes: {
    size: {
      control: "radio",
      options: sizes,
    },
    variant: {
      control: "radio",
      options: variants,
    },
  },
  component: Button,
  title: "UI/Button",
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <Button {...args} variant="default" />
      <Button {...args} variant="outline" />
      <Button {...args} variant="ghost" />
      <Button {...args} variant="destructive" />
      <Button {...args} variant="link" />
    </div>
  ),
};
