import { useState } from 'react';
import { Button, Group, Select, Switch, Textarea } from '@mantine/core';

export function GlobalSettings() {
  const [defaultModel, setDefaultModel] = useState<string>("");
  const [systemInstruction, setSystemInstruction] = useState<string>("You are a helpful AI assistant.");
  const [streamResponses, setStreamResponses] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium mb-2">Default Model</div>
        <Select
          value={defaultModel}
          onChange={(value: string | null) => setDefaultModel(value || "")}
          data={[
            { value: "gpt-4", label: "GPT-4" },
            { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
          ]}
        />
      </div>

      <div>
        <Group justify="space-between">
          <div className="text-sm font-medium">System Instruction</div>
          <Button
            variant="subtle"
            size="xs"
            onClick={() => setSystemInstruction("You are a helpful AI assistant.")}
          >
            Reset to default
          </Button>
        </Group>
        <Textarea
          value={systemInstruction}
          onChange={(e) => setSystemInstruction(e.currentTarget.value)}
          minRows={3}
          className="mt-2"
        />
      </div>

      <Switch
        label="Stream AI responses word by word"
        checked={streamResponses}
        onChange={(e) => setStreamResponses(e.currentTarget.checked)}
      />
    </div>
  );
}