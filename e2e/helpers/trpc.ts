import type { APIRequestContext } from "@playwright/test";

interface ITrpcEnvelope<T> {
  result: { data: { json: T } };
}

async function postTrpc<T>(
  request: APIRequestContext,
  procedure: string,
  input: unknown
): Promise<T> {
  const response = await request.post(`/api/trpc/${procedure}`, {
    data: { json: input },
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok()) {
    throw new Error(
      `tRPC ${procedure} fehlgeschlagen: ${response.status()} ${await response.text()}`
    );
  }
  const body = (await response.json()) as ITrpcEnvelope<T>;
  return body.result.data.json;
}

export interface ICreateGameshowInput {
  name: string;
  games?: unknown[];
}

export async function createGameshowViaApi(
  request: APIRequestContext,
  input: ICreateGameshowInput
): Promise<{ id: string }> {
  return postTrpc<{ id: string }>(request, "gameshows.create", {
    games: [],
    ...input
  });
}

export async function deleteGameshowViaApi(
  request: APIRequestContext,
  gameshowId: string
): Promise<void> {
  await postTrpc<unknown>(request, "gameshows.delete", { gameshowId });
}
