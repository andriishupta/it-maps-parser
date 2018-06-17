import { env } from '../lib/env'
import axios from 'axios'

export default class GeocodingService {
  constructor(logger) {
    this.logger = logger
  }

  get apiUrl() {
    return env.GEOLOCATION.API_URL
  }

  async getCoords(address) {
    try {
      const geo = await axios.get(this.apiUrl + address)
      const location = geo.results[0].geometry.location
      this.logger.debug(`Got location for: ${address}`)

      return location
    } catch (e) {
      this.logger.debug(`Error with location for: ${address}`)
      return {}
    }
  }
}
