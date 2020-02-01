// <<<<<<< Updated upstream
import Route from "@ember/routing/route";

export default class IndexRoute extends Route {
  model() {
    return this.store.findAll("statistic").then(res => {
      return [res.get("firstObject")];
    });
  }

  // async model(id) {
  // 	if(+id) {
  // 		let record = await this.store.findRecord("statistic", id)
  // 		.then(data => {
  // 			console.log(data)
  // 		})
  // 	}

  // 	let firstRecord = await this.store.findAll("statistic")
  // 	.then(items => {
  // 		let object = items.get("firstObject")
  // 		return this.generateArray(object)
  // 	})
  // 	.catch(err => console.log(err))

  // 	return firstRecord
  // }

  // generateArray(obj) {
  // 	let result = new Map()

  // 	for(let key of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))) {
  // 		if(key == "constructor")
  // 			continue

  // 		result.set(key, obj[key])
  // 	}

  // 	return result.entries()
  // }

  // lmao(input) {
  // 	console.log(input)
  // }
// =======
// import Route from '@ember/routing/route';
// import {action} from "@ember/object"

// import d3 from 'd3'



// export default class IndexRoute extends Route {
// 	@action
// 	didTransition() {
// 		console.log(document.body.innerHTML)
// 		// this.generateChart("#bit", this.generateMapEntries(this.model, 'stats'))
// 		d3.selectAll("body").text("kasdkasjkdasjhd")
// 	}

// 	generateChart(to, stats) {
// 		const margin = {
// 			top: 	20,
// 			right: 	20,
// 			bottom: 20,
// 			left: 	20,
// 		}
// 		const size = {
// 			width: 	600,
// 			height: 500,
// 		}
// 		const bar = {
// 			width: 20,
// 			offset: 5,
// 		}

// 		const svg = d3.select(to)
// 			.append("svg")
// 				.attr("width", size.width + margin.left + margin.right)
// 				.attr("height", size.height + margin.top + margin.bottom)
// 			.append("g")
// 				// .attr("transform", `translate(${margin.left}, ${margin.top})`)

// 		const bitrate = []
// 		for(let i = 0; i < 20; i++)
// 			bitrate.push(this.random(10, 9000))
// 		bitrate.map((value, i) => {
// 			svg.append("rect")
// 				.attr("class", "bar")
// 				.attr("width", bar.width)
// 		})

// 		const valueRange = [
// 			0,
// 			d3.max(bitrate)
// 		]

// 		const scale = d3.scaleLinear()
// 			.range([0, size.height + margin.top + margin.bottom])
// 			.domain(valueRange)


// 		const bars = d3.selectAll(".bar").data(bitrate)
// 		// bars.exit().remove()
		
// 		const addBars = bars
// 			.enter()
// 				.append("rect")
// 					.attr("class", "bar")
// 					.attr("width", bar.width)

// 		addBars.merge(bars)
// 			.transition()
// 				.duration(900)
// 					.attr("height", d => scale(d))
// 					.attr("x", (d, n) => n * bar.width + n * bar.offset)
// 	}


// 	async model(id) {
// 		if(+id) {
// 			let record = await this.store.findRecord("statistic", id)
// 			.then(data => {
// 				console.log(data)
// 			})
// 		}

// 		let firstRecord = await this.store.findAll("statistic")
// 		.then(items => {
// 			let object = items.get("firstObject")


// 			return this.generateMapEntries(object)
// 		})
// 		.catch(err => console.log(err))


// 		return firstRecord
// 	}

// 	random(min, max) {
// 		let rand = min + Math.random() * (max + 1 - min);
// 		return Math.floor(rand);
// 	}

// 	generateMapEntries(obj, field) {
// 		let result = new Map()
		
// 		for(let key of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))) {
// 			if(key == "constructor")
// 				continue

// 			if(key == field)
// 				return [key, obj[key]]

// 			result.set(key, obj[key])
// 		}

// 		return result.entries()
// 	}

// 	lmao(input) {
// 		console.log(input)
// 	}
// >>>>>>> Stashed changes
}
