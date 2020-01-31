import Controller from "@ember/controller";
import { action } from "@ember/object";
import d3 from 'd3'

export default class IndexController extends Controller {
  hello = "hello word";

  constructor(args) {
    super(args);
    //console.log(this);
  }

  @action
  searchStat() {
    this.store
      .query("statistic", {
        filter: {
          lesson_id: this.lesson_id
        }
      })
      .then(result => {
        this.model = result;
        this.drawChart()
      });
  }

  drawChart() {
    // let time = this.model.reduce((prev, item) => {
    //   return item.stats.timestamp - prev
    // }, 0) / 1000
    // let bytes =  8 * this.model.reduce((prev, item) => {
    //   return Math.abs(item.stats.video.bytes_sent - prev)
    // }, 0)

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 40, bottom: 30, left: 30},
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var sVg = d3.select("#area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // translate this svg element to leave some margin.
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X scale and Axis
    var x = d3.scaleLinear()
    .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([0, width]);       // This is the corresponding value I want in Pixel
    sVg
    .append('g')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // X scale and Axis
    var y = d3.scaleLinear()
    .domain([0, 100])         // This is the min and the max of the data: 0 to 100 if percentages
    .range([height, 0]);       // This is the corresponding value I want in Pixel
    sVg
    .append('g')
    .call(d3.axisLeft(y));
  }
}
