import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './toaster';
import { Button } from './button';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <Toaster />
      <div className="space-x-2">
        <Button onClick={() => alert('Toast shown!')}>
          Show Toast Example
        </Button>
      </div>
      <p className="text-sm text-neutral-400">
        Note: Toaster is a global provider. In Storybook, it renders the toast component.
        In the actual app, use the Toaster component to display toast notifications.
      </p>
    </div>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <div className="p-4">
      <Toaster theme="dark" />
      <p className="text-sm text-neutral-400">Dark theme toaster (default)</p>
    </div>
  ),
};

export const LightTheme: Story = {
  render: () => (
    <div className="p-4 bg-neutral-100">
      <Toaster theme="light" />
      <p className="text-sm text-neutral-600">Light theme toaster</p>
    </div>
  ),
};
