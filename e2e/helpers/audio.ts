import type { BrowserContext, Page } from "@playwright/test";

interface IAudioWindow {
  __e2ePlayedSounds?: string[];
}

/**
 * Replaces `HTMLMediaElement.play` so no sound is ever emitted. Every call is
 * recorded by file name, which lets tests assert that a sound was triggered.
 */
export async function muteAudio(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    const played: string[] = [];
    (window as unknown as IAudioWindow).__e2ePlayedSounds = played;
    HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement) {
      played.push(new URL(this.currentSrc || this.src, location.href).pathname);
      return Promise.resolve();
    };
  });
}

export async function getPlayedSounds(page: Page): Promise<string[]> {
  return page.evaluate(
    () => (window as unknown as IAudioWindow).__e2ePlayedSounds ?? []
  );
}
