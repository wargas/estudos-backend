import { AssetsConfig } from '@ioc:Adonis/Core/Static'

const staticConfig: AssetsConfig = {
  enabled: false,
  dotFiles: 'ignore',
  etag: true,
  lastModified: true,
}

export default staticConfig
