export default class Scratcher {
  constructor(companyRepository, companyStore, geocodingService, logger) {
    this.companyRepository = companyRepository
    this.geocodingService = geocodingService
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
      this.logger.debug(`Getting locations ...`)

      const companies = await this.companyStore.find()
      companies.forEach((company, index) => {
        setTimeout(async () => {
          try {
            const locationQuery = await this.companyRepository.fetchCompanyLocation(
              company
            )
            const location = await this.geocodingService.getCoords(
              locationQuery
            )
            location.q = locationQuery
            await this.companyStore.update(company._id, { location })
          } catch (e) {
            this.logger.error(`Error with location for: `, company.name)
            this.logger.debug(`... skipping`)
          }
        }, index * 1000)
      })
    } else {
      return this.run()
    }
  }
}
