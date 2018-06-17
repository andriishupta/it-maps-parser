import { NotFound, BadRequest } from 'fejl'

/**
 * Company Service.
 * Gets a company store injected.
 */
export default class CompanyService {
  constructor(companyStore) {
    this.companyStore = companyStore
  }

  async find(params) {
    return this.companyStore.find(params)
  }

  async get(id) {
    BadRequest.assert(id, 'No id given')
    const company = await this.companyStore.get(id)
    NotFound.assert(company, `Todo with id "${id}" not found`)

    return company
  }

  async create(data) {
    BadRequest.assert(data, 'No company payload given')
    BadRequest.assert(data.name, 'name is required')
    BadRequest.assert(data.href, 'href is required')

    return this.companyStore.create(data)
  }

  async update(id, data) {
    BadRequest.assert(id, 'No id given')
    BadRequest.assert(data, 'No company payload given')

    await this.get(id)
    return this.companyStore.update(id, data)
  }

  async remove(id) {
    await this.get(id)
    return this.companyStore.remove(id)
  }
}
