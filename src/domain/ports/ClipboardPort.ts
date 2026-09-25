export interface ClipboardPort {
  copyText(text: string): Promise<boolean>;
}
