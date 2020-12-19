import { assign } from 'lodash'
import axios from 'axios'
import { env } from '../lib/env'
import ParserService from './parser-service'

export default class CompanyRepository {
  constructor(logger) {
    this.logger = logger
    this.headers = null
    this.csrfmiddlewaretoken = null

    this._fetched = parseInt(env.SCRATCHER.START_COUNT) || 0
  }

  set fetched(fetched) {
    this._fetched = fetched
  }

  get fetched() {
    return this._fetched
  }

  get countStep() {
    return parseInt(env.SCRATCHER.STEP)
  }

  get maxCount() {
    return parseInt(env.SCRATCHER.MAX_COUNT)
  }

  get cities() {
    return env.SCRATCHER.CITIES.split(',')
  }

  get getUrl() {
    return env.SCRATCHER.GET_URL
  }

  get locationPath() {
    return env.SCRATCHER.LOCATION_PATH
  }

  get apiUrl() {
    return env.SCRATCHER.API_URL
  }

  getHeaders(cookies) {
    if (this.headers) {
      return this.headers
    }

    return assign(
      { ...env.SCRATCHER.HEADERS },
      {
        Cookie: cookies,
        'Content-type': 'application/x-www-form-urlencoded'
      }
    )
  }

  async setup() {
    this.logger.debug(`Setting up CompanyRepository...`, {
      scope: `CompanyRepository.setup`
    })
    if (this.headers && this.csrfmiddlewaretoken) {
      this.logger.debug(`skipping setup...`)
      return true
    }

    try {
      const response = await axios.get(this.getUrl)
      const html = response.data

      this.csrfmiddlewaretoken = ParserService.getCsrfToken(html)
      const cookies = response.headers['set-cookie'][0]
      this.headers = this.getHeaders(cookies)

      this.logger.debug(`headers ${this.headers}`)

      this.logger.debug(`CompanyRepository setup finished`)
    } catch (e) {
      this.logger.error(`Error with CompanyRepository setup: ${e}`)
      throw new Error(e)
    }
  }

  async fetchCompanies(city) {
    await this.setup()

    this.logger.debug(`Fetching companies...`, {
      scope: `CompanyRepository.fetchCompanies`
    })

    const body = `csrfmiddlewaretoken=${this.csrfmiddlewaretoken}&count=${
      this.fetched
    }`
    this.fetched = this.fetched + this.countStep

    try {
      this.logger.debug(`Fetching companies...`, {
        scope: `CompanyRepository.fetchCompanies`
      })
      const { data } = await axios.post(this.apiUrl + city, body, {
        headers: this.headers
      })
      return ParserService.getCompanies(data.html)
    } catch (e) {
      this.logger.error(`Cannot fetch companies ${e}`)
      throw new Error(e)
    }
  }

  async fetchCompanyLocation(company, city) {
    await this.setup()

    this.logger.debug(`Fetching locations...`, {
      scope: `CompanyRepository.fetchCompanyLocation`
    })

    try {
      this.logger.debug(`Fetching location page...`)
      const { data } = await axios.get(company.url + this.locationPath)
      return ParserService.getLocationQuery(data, city)
    } catch (e) {
      this.logger.error(`Cannot fetch location page ${e}`)
      throw new Error(e)
    }
  }
}
