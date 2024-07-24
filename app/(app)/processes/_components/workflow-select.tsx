"use client";

import {
  Combobox,
  InputBase,
  Input,
  Loader,
  useCombobox,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { createFormActions } from "@mantine/form";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useServerActionQuery } from "@hooks/server-actions";
import { getWorkflowsAction } from "../_actions";

export const WorkflowSelect = ({
  formActionName,
  formField,
  label,
  initialValue,
  error,
}: {
  formActionName: string;
  formField: string;
  label?: string;
  initialValue?: { id: string; name: string } | null;
  error?: string;
}) => {
  const formAction = createFormActions(formActionName);
  const [firstOpen, setFirstOpen] = useState(false);
  const [value, setValue] = useState<{ id: string; name: string } | null>(
    initialValue || null
  );

  const [search, setSearch] = useState("");

  const [debounced] = useDebouncedValue(search, 300);

  const { isLoading, data } = useServerActionQuery(getWorkflowsAction, {
    input: {
      search: debounced,
    },
    queryKey: [debounced],
    enabled: firstOpen,
  });
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
      if (!firstOpen) {
        setFirstOpen(true);
      }
    },
  });

  return (
    <Stack gap={rem(4)}>
      <Text component="label" size="sm" fw={500}>
        {label}
      </Text>
      <Combobox
        store={combobox}
        withinPortal={true}
        onOptionSubmit={(val) => {
          const filteredWorkflow =
            data && data.workflows.filter((workflow) => workflow.id === val);
          setValue(filteredWorkflow[0]);
          formAction.setFieldValue(formField, filteredWorkflow[0]);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
          >
            {(value && value.name) || (
              <Input.Placeholder>choose Workflow</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="choose Workflow"
          />
          <Combobox.Options>
            {data && data.workflows.length > 0 ? (
              data.workflows.map((item) => (
                <Combobox.Option value={item.id} key={item.id}>
                  {item.name}
                </Combobox.Option>
              ))
            ) : (
              <Combobox.Empty>
                {data &&
                  data.workflows.length === 0 &&
                  "Could not find any workflows"}
                {isLoading && <Loader />}
              </Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      {error && (
        <Text c="red" size="xs">
          {error}
        </Text>
      )}
    </Stack>
  );
};
