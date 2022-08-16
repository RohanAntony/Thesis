import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  private margin = {top: 20, right: 20, bottom: 20, left: 50};
  private width: number = 0;
  private height: number = 0;
  private xAxis: any;
  private yAxis: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]> | undefined;
  public title: string = 'Chart';

  private data: any[] = [
    {date: new Date('2010'), value: 40},
    {date: new Date('2011'), value: 93},
  ];
  private data2: any[] = [
    {date: new Date('2010'), value: 140},
    {date: new Date('2011'), value: 193},
  ];

  constructor() {
  }

  private addXandYAxis(minX:Date, maxX:Date, minY: number, maxY: number) {
    // range of data configuring
    this.xAxis = d3Scale.scaleTime().range([0, this.width]);
    this.yAxis = d3Scale.scaleLinear().range([this.height, 0]);
    this.xAxis.domain([minX, maxX]);
    this.yAxis.domain([minY, maxY]);
    // Configure the X Axis
    this.svg.append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.xAxis));
    // Configure the Y Axis
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.yAxis));
  }

  private drawLineAndPath(data: any, xField: string, yField: string) {
    this.line = d3Shape.line()
        .x( (d: any) => this.xAxis(d[xField]) )
        .y( (d: any) => this.yAxis(d[yField]) );
    // Configuring line path
    this.svg.append('path')
        .datum(data)
        .attr('d', this.line);
  }

  ngOnInit(): void {
    const svgRect = (d3.select('svg').node() as Element).getBoundingClientRect();
    this.width = svgRect.width - this.margin.left - this.margin.right;
    this.height = svgRect.height - this.margin.top - this.margin.bottom;
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.addXandYAxis(new Date('2010'), new Date('2011'), -100, 300);
    this.drawLineAndPath(this.data, 'date', 'value');
    this.drawLineAndPath(this.data2, 'date', 'value');
  }

}
