import Route from '@ember/routing/route';



export default class IndexRoute extends Route {
	async model(id) {
		if(+id) {
			let record = await this.store.findRecord("statistic", id)
			.then(data => {
				console.log(data)
			})
		}

		let firstRecord = await this.store.findAll("statistic")
		.then(items => {
			let object = items.get("firstObject")
			return this.generateArray(object)
		})
		.catch(err => console.log(err))

		return firstRecord
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

	lmao(input) {
		console.log(input)
	}
}
