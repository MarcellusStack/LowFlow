export type CallN8nWebhookParams = {
  workflowName: string;
  submissionData: any;
};

export async function callN8nWebhook({
  workflowName,
  submissionData,
}: CallN8nWebhookParams): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_N8N_URL}/webhook/${workflowName}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-N8N-WEBHOOK-API-KEY": process.env.N8N_API_KEY as string,
    },
    body: JSON.stringify(submissionData),
  });

  if (!response.ok) {
    throw new Error(`Failed to send data to ${workflowName}`);
  }
}
