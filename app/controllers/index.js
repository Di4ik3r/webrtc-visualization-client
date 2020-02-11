import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import d3 from "d3";
import UAParser from "ua-parser-js";

export default class IndexController extends Controller {
  constructor(args) {
    super(args);
  }

  @tracked isLoading = false;

  @action
  searchStat(lesson_id) {
    this.isLoading = true;

    if (this.validate(lesson_id)) {
      this.store
        .query("statistic", {
          filter: {
            lesson_id: lesson_id
          }
        })
        .then(result => {
          if (result.content.length !== 0) {
            this.isLoading = false;
            let userAgents = this.getUserAgents(result);
            let lessonDuration = this.getLessonDuration(result);
            let errors = this.getLessonErrors(result);

            this.model = {
              result,
              userAgents,
              lessonDuration,
              errors
            };

            this.drawBitsChart();
            this.drawPackageLossChart();
          } else {
            this.showValidationError("Lesson wasnt found");
          }
        })
        .catch(e => console.log(e));
    }
  }

  validate(lesson_id) {
    this.showValidationError("", true);
    if (lesson_id === undefined || lesson_id === "") {
      this.showValidationError("Lesson id is undefined");
      return false;
    } else if (lesson_id.length < 6) {
      this.showValidationError("Lesson id cannot be shorter than 6");
      return false;
    }
    return true;
  }

  showValidationError(err, isLoading = false) {
    this.model = {
      validationError: err
    };
    this.isLoading = isLoading;
  }

  getLessonErrors(statData) {
    let errors = statData
      .filter(element => {
        return element.event_type === -1;
      })
      .map(element => {
        let temp = element.note.split(":");
        return {
          header: temp[0],
          body: temp[1]
        };
      });

    return errors;
  }

  getLessonDuration(statData) {
    let datesArray = statData
      .filter(element => {
        return element.event_type === 4;
      })
      .reduce((prev, current) => {
        if (current.stats !== null) {
          return [...prev, current.stats.timestamp];
        } else {
          return [...prev, null];
        }
      }, [])
      .filter(element => {
        return element !== null;
      })
      .sort((prev, curr) => prev - curr);

    let timeString = "No info";

    if (datesArray.length !== 0) {
      let startTimestamp = datesArray[0];
      let endTimestamp = datesArray[datesArray.length - 1];

      let startDate = new Date(startTimestamp);
      let endDate = new Date(endTimestamp);

      let secondsDuration = this.diffSeconds(startDate, endDate);

      let date = new Date(null);
      date.setSeconds(secondsDuration);
      timeString = date.toISOString().substr(11, 8);
    }

    return timeString;
  }

  diffSeconds(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    return Math.abs(Math.round(diff));
  }

  getUserAgents(statData) {
    let parser = new UAParser();
    let set = new Set();
    let userAgents = [];

    statData.forEach(element => {
      let res = parser.setUA(element.user_agent).getResult();
      set.add(JSON.stringify(res));
    });

    set.forEach(element => {
      userAgents.push(JSON.parse(element));
    });

    return userAgents;
  }

  drawPackageLossChart() {
    // приведення даних
    let dataset = [];
    this.model.result.forEach(item => {
      if (!item.stats) return;
      let loss = +item.stats.video.packets_lost || null;
      let sent = +item.stats.video.packets_sent;

      if (!loss) {
        dataset.push(0);
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
    svg
      .selectAll(".dot")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(d, i) {
        return xScale(i);
      })
      .attr("cy", function(d) {
        return yScale(d);
      })
      .attr("r", 5);
    // .on("mouseover", function(a, b, c) {
    //   console.log(a)
    //   d3.selectAll(".dot").classed("focus", true)
    //  })
    // .on("mouseout", function() { d3.selectAll(".dot").classed(".focus", false) })
  }

  drawBitsChart() {
    // приведення даних
    let dataset = [];
    let first;
    this.model.result.forEach(item => {
      if (!item.stats) return;

      let bytes = item.stats.video.bytes_sent;
      let timestamp = item.stats.timestamp;

      dataset.push({
        bit: bytes,
        time: timestamp
      });
    });
    dataset.sort((prev, current) => prev.time - current.time);
    
    first = dataset.shift()
    console.log(first)

    dataset.forEach(item => {
      let currentTime = item.time - first.time;
      let currentBytes = item.bit - first.bit;
      
      let bitrate = (item.currentBytes * 8) / (currentTime * 1000)
      
      // console.log(`bit: ${item.bit}; bitrate: ${bitrate}`)
      // console.log(`time: ${item.time}; curTime: ${currentTime}`)
      
      item.bit = bitrate;
      
      console.log(item)

      first = item;
    })

    // відступи для "margin convention"
    let margin = { top: 10, right: 5, bottom: 30, left: 90 },
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // скейл для timestamp
    let xScale = d3
      .scaleTime()
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
    svg
      .selectAll(".dot")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(d, i) {
        return xScale(d.time);
      })
      .attr("cy", function(d) {
        return yScale(d.bit);
      })
      .attr("r", 5);
    // .on("mouseover", function(a, b, c) {
    //   console.log(a)
    //   d3.selectAll(".dot").classed("focus", true)
    //  })
    // .on("mouseout", function() { d3.selectAll(".dot").classed(".focus", false) })
  }
}
