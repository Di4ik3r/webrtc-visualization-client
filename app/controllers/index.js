import Controller from "@ember/controller";
import { action } from "@ember/object";
import d3 from "d3";

export default class IndexController extends Controller {
  hello = "hello word";

  constructor(args) {
    super(args);
  }

  @action
  searchStat(lesson_id) {
    this.store
      .query("statistic", {
        filter: {
          lesson_id: lesson_id
        }
      })
      .then(result => {
        this.model = result;
        this.drawBitsChart();
        this.drawPackageLossChart();
      });
  }

  drawPackageLossChart() {
    // приведення даних
    let dataset = [];
    this.model.forEach(item => {
      let loss = +item.stats.video.packets_lost || null;
      let sent = +item.stats.video.packets_sent;

      if (!loss) {
        dataset.push(1);
        return;
      }

      let result = loss / sent;
      dataset.push(result);
    });
    //dataset.sort((prev, current) => prev.time < current.time);

    // відступи для "margin convention"
    let margin = { top: 10, right: 5, bottom: 30, left: 30 },
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // скейл для timestamp
    let xScale = d3
      .scaleLinear()
      .domain([0, dataset.length - 1])
      .range([0, width]);

    // скейл для bit
    let yScale = d3
      .scaleLinear()
      // .domain(d3.extent(dataset))
      .domain([0, 1])
      .range([height, 0]);

    // d3 лайн генератор
    let line = d3
      .line()
      .x(function(d, i) {
        return xScale(i);
      })
      .y(function(d, i) {
        return yScale(d);
      })
      .curve(d3.curveMonotoneX);

    // коректне створення svg елемента
    if (!d3.select("#packageloss").empty()) {
      d3.select("#packageloss").remove();
    }
    let svg = d3
      .select("#packageloss-area")
      .append("svg")
      .attr("id", "packageloss")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // створення осі ОХ
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // створення осі ОY
    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));

    // створення лінії
    svg
      .append("path")
      .datum(dataset) // біндимо дані до лінії
      .attr("class", "line") // css клас для кастомного стиля
      .attr("d", line); // виклик генератора лінії, який ми оголосили до цього

    // створення датапоінтів
    svg.selectAll(".dot")
        .data(dataset)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d, i) { return xScale(i) })
        .attr("cy", function(d) { return yScale(d) })
        .attr("r", 5)
          // .on("mouseover", function(a, b, c) { 
          //   console.log(a) 
          //   d3.selectAll(".dot").classed("focus", true)
          //  })
          // .on("mouseout", function() { d3.selectAll(".dot").classed(".focus", false) })
  }

  drawBitsChart() {
    // приведення даних
    let dataset = []
    this.model.forEach(item => 
      dataset.push({
        bit: item.stats.video.bytes_sent,
        time: item.stats.timestamp
      })
    )
    dataset.sort((prev, current) => prev.time - current.time)

    // відступи для "margin convention"
    let margin = { top: 10, right: 5, bottom: 30, left: 90 },
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // скейл для timestamp
    let xScale = d3.scaleTime()
        .domain(d3.extent(dataset, item => item.time))
        .range([0, width]);

    // скейл для bit
    let yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, item => item.bit))
      .range([height, 0]);

    // d3 лайн генератор
    let line = d3
      .line()
      .x(function(d, i) {
        return xScale(d.time);
      })
      .y(function(d, i) {
        return yScale(d.bit);
      })
      .curve(d3.curveMonotoneX);

    // коректне створення svg елемента
    if (!d3.select("#bits").empty()) {
      d3.select("#bits").remove();
    }
    let svg = d3
      .select("#bits-area")
      .append("svg")
      .attr("id", "bits")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // створення осі ОХ
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // створення осі ОY
    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale));

    // створення лінії
    svg
      .append("path")
      .datum(dataset) // біндимо дані до лінії
      .attr("class", "line") // css клас для кастомного стиля
      .attr("d", line); // виклик генератора лінії, який ми оголосили до цього

    // створення датапоінтів
    svg.selectAll(".dot")
        .data(dataset)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d, i) { return xScale(d.time) })
        .attr("cy", function(d) { return yScale(d.bit) })
        .attr("r", 5)
          // .on("mouseover", function(a, b, c) { 
          //   console.log(a) 
          //   d3.selectAll(".dot").classed("focus", true)
          //  })
          // .on("mouseout", function() { d3.selectAll(".dot").classed(".focus", false) })
  }
}
