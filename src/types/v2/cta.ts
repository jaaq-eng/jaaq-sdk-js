type CtaV2DTO = {
  url?: string;
  label?: string;
  labelColor?: string;
  /** Video Reference only. Text shown beside the label. */
  description?: string;
  /**
   * Video Reference only. `false` opens the link in the page that embeds the player, instead of a new tab.
   * The API sends it for every Video Reference; older API versions leave it out, which also means a new tab.
   */
  openInNewTab?: boolean;
  /** Video Reference only. The player shows this image in place of the text banner. */
  imageUrl?: string;
};

export type { CtaV2DTO };
