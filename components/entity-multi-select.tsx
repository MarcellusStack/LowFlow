"use client";

import {
  Combobox,
  Loader,
  useCombobox,
  Stack,
  Text,
  rem,
  Pill,
  PillsInput,
} from "@mantine/core";
import { createFormActions } from "@mantine/form";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useServerActionQuery } from "@hooks/server-actions";

export type EntityMultiSelectProps = {
  formActionId: string;
  formField: string;
  label?: string;
  initialValue?: string[] | null;
  action: any;
};

export const EntityMultiSelect = ({
  formActionId,
  formField,
  label,
  initialValue,
  action,
}: EntityMultiSelectProps) => {
  const formAction = createFormActions(formActionId);
  const [firstOpen, setFirstOpen] = useState(false);
  const [value, setValue] = useState<string[]>(initialValue || []);
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
          const isItemSelected = value.includes(val);

          if (isItemSelected) {
            setValue(value.filter((v) => v !== val));
            formAction.removeListItem(formField, value.indexOf(val));
          } else {
            setValue([...value, val]);
            formAction.insertListItem(formField, val);
          }
        }}
      >
        <Combobox.Target>
          <PillsInput onClick={() => combobox.openDropdown()}>
            <Pill.Group>
              {value.map((item, index) => (
                <Pill
                  key={item}
                  withRemoveButton
                  onRemove={() => {
                    setValue((current) => current.filter((v) => v !== item));
                    formAction.removeListItem(formField, index);
                  }}
                >
                  {item}
                </Pill>
              ))}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder="Search entities"
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search entities"
          />
          <Combobox.Options>
            {data && data.length > 0 ? (
              data.map((item) => (
                <Combobox.Option value={item} key={item}>
                  {item}
                </Combobox.Option>
              ))
            ) : (
              <Combobox.Empty>
                {data && data.length === 0 && "No entities found"}
                {isLoading && <Loader />}
              </Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Stack>
  );
};
