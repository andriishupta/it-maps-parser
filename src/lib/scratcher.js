export default class Scratcher {
  constructor(companyRepository, companyStore, logger) {
    this.companyRepository = companyRepository
    this.companyStore = companyStore
    this.logger = logger
  }

  async run() {
    this.logger.debug(`Scratcher.run ...`, { scope: 'Scratcher' })
    const companies = await this.companyRepository.fetchCompanies()
    await this.companyStore.insert(companies)
    this.logger.debug(`Fetched and saved companies`)

    if (this.companyRepository.maxCount === this.companyRepository.fetched) {
      this.logger.debug(`Fetched and saved all requested companies`)
    } else {
      return this.run()
    }
  }
}
