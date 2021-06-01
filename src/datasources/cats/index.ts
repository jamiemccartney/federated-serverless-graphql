const { RESTDataSource } = require('apollo-datasource-rest');

export default class CatFactsAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://catfact.ninja/';
    }

    async getFact() {
        return await this.get(`fact`);
    }
}
