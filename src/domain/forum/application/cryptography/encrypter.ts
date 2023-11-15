export abstract class Encrypter {
  abstract encrypt(payload: string): Promise<string>
}
