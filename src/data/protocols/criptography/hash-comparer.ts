export interface HashComparer {
  compare: (value: string, valueEncrypted: string) => Promise<boolean>
}
