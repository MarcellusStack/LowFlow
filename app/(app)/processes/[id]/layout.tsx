import { notFound } from "next/navigation";
import { SubLayout } from "@components/layouts/sub-layout";
import {
  IconAlertTriangle,
  IconInfoSquare,
  IconTemplate,
} from "@tabler/icons-react";
import { getProcess } from "./_actions";

export default async function Layout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { id } = params;

  const process = await getProcess({ id });

  if (!process) {
    notFound();
  }
  return (
    <SubLayout
      title={process.name}
      subtitle={process.description}
      links={[
        {
          value: `/`,
          icon: <IconInfoSquare size={16} stroke={1.5} />,
          label: "General",
        },
        {
          value: `editor`,
          icon: <IconTemplate size={16} stroke={1.5} />,
          label: "Editor",
        },
        {
          value: `danger`,
          icon: <IconAlertTriangle size={16} stroke={1.5} />,
          label: "Danger",
        },
      ]}
      page="processes"
    >
      {children}
    </SubLayout>
  );
}
