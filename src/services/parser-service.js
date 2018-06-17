import { JSDOM } from 'jsdom'

export default class ParserService {
  static parse(html) {
    return new JSDOM(html).window.document
  }

  static getCsrfToken(html) {
    const doc = ParserService.parse(html)
    return doc.querySelector("input[name='csrfmiddlewaretoken']").value
  }

  static getCompanies(html) {
    const doc = ParserService.parse(html)
    const domCompanies = doc.querySelectorAll('.company')
    const companies = []

    domCompanies.forEach(function(domCompany) {
      const cnAnchor = domCompany.querySelector('.cn-a')
      companies.push({
        name: cnAnchor.textContent,
        url: cnAnchor.href
      })
    })

    return companies
  }

  static getLocationQuery(html, city) {
    const doc = ParserService.parse(html)
    const byCity = doc.querySelector(`#${city}`).parentElement
    return byCity.querySelector('.address a').href
  }
}
