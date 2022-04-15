import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as String,
  isConnected: Boolean,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri)
    this.isConnected = true
    this.client.on('topologyClosed', () => {
      this.isConnected = false
    })
  },
  async disconnect () {
    await this.client.close()
    this.client = null
    this.isConnected = false
  },
  async getCollection (name: string): Promise<Collection> {
    if (!this.client || !this.isConnected) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },
  map (value: any, insertedId: string): any {
    return ({ ...value, id: insertedId, _id: undefined })
  }

}
