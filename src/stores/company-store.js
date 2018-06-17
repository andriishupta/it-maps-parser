import Company from './models/company'

export default class CompanyStore {
  constructor(logger) {
    this.logger = logger
  }

  async find() {
    this.logger.debug(`Getting all companies`)
    return Company.find({})
  }

  async get(id) {
    this.logger.debug(`Getting company with id ${id}`)
    return Company.find({ _id: id })
  }

  async create(data) {
    const company = new Company(data)
    this.logger.debug(`Created new company`, company)
    return company.save()
  }

  async insert(companies) {
    this.logger.debug(`Inserting companies: ${companies}`, {
      scope: 'CompanyStore.insert'
    })
    return new Promise((resolve, reject) => {
      Company.collection.insert(companies, (err, docs) => {
        if (err) {
          this.logger.error(`Error with insert`)
          throw Error(err)
        }
        this.logger.debug(`Inserted companies`)
        resolve(true)
      })
    })
  }

  async update(id, data) {
    this.logger.debug(`Update company: `, id)
    return new Promise((resolve, reject) => {
      Company.update({ _id: id }, { $set: data }, (err, result) => {
        if (err) {
          this.logger.error(`Error with update`)
          throw Error(err)
        }
        this.logger.debug(`Updated`)
        resolve(true)
      })
    })
  }

  async remove(id) {
    const company = this.get(id)
    return company.remove()
  }
}
