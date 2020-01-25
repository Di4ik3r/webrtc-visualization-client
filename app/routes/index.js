import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
	async model() {
		let firstElement = await this.store.findAll("statistic")
		.then(items => {
			let object = items.get("firstObject")
			return this.generateArray(object)
		})
		.catch(err => console.log(err))

		// for(let record of firstElement) {
		// 	console.log(record)
		// }

		return firstElement
	}

	generateArray(obj) {
		let result = new Map()
		
		for(let key of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))) {
			if(key == "constructor")
				continue

			result.set(key, obj[key])
		}

		return result.entries()
	}
}
