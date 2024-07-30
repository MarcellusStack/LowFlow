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

export type EntitySelectProps = {
  formActionName: string;
  formField: string;
  label?: string;
  initialValue?: { id: string; [key: string]: any } | null;
  error?: string;
  action: any;
  displayKey: string;
  dataKey: string;
};

export const EntitySelect = ({
  formActionName,
  formField,
  label,
  initialValue,
  error,
  action,
  displayKey,
  dataKey,
}: EntitySelectProps) => {
  const formAction = createFormActions(formActionName);
  const [firstOpen, setFirstOpen] = useState(false);
  const [value, setValue] = useState<{ id: string; [key: string]: any } | null>(
    initialValue || null
  );

  const [search, setSearch] = useState("");

  const [debounced] = useDebouncedValue(search, 300);

  const { isLoading, data } = useServerActionQuery(action, {
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
          const filteredEntity =
            data && data[dataKey].filter((entity) => entity.id === val);
          setValue(filteredEntity[0]);
          formAction.setFieldValue(formField, filteredEntity[0]);
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
            {(value && value[displayKey]) || (
              <Input.Placeholder>choose Entity</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="choose Entity"
          />
          <Combobox.Options>
            {data && data[dataKey].length > 0 ? (
              data[dataKey].map((item) => (
                <Combobox.Option value={item.id} key={item.id}>
                  {item[displayKey]}
                </Combobox.Option>
              ))
            ) : (
              <Combobox.Empty>
                {data &&
                  data[dataKey].length === 0 &&
                  "Could not find any entities"}
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
