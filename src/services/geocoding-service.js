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
    this.logger.debug(`Getting location: ${address}`, {
      scope: 'Geocoding.getCoords'
    })
    try {
      const { data } = await axios.get(this.apiUrl + address)
      const location = data.results[0].geometry.location
      this.logger.debug(`Got location for: ${address}`)

      return location
    } catch (e) {
      this.logger.debug(`Geocoding.getCoords error: ${e}`)
      return {}
    }
  }
}
