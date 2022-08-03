import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array'
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private data: any[] = [
    {date: new Date('2010-01-01'), value: 40},
    {date: new Date('2010-01-04'), value: 93},
    {date: new Date('2010-01-05'), value: 95},
    {date: new Date('2010-01-06'), value: 130},
    {date: new Date('2010-01-07'), value: 110},
    {date: new Date('2010-01-08'), value: 120},
    {date: new Date('2010-01-09'), value: 129},
    {date: new Date('2010-01-10'), value: 107},
    {date: new Date('2010-01-11'), value: 140},
  ];
  private line: d3Shape.Line<[number, number]> | undefined; // this is line defination

  public title: string = 'Chart';

  constructor() {
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  private buildSvg() {
    this.svg = d3.select('svg') // svg element from html
      .append('g')   // appends 'g' element for graph design
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private addXandYAxis() {
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.data, (d) => d.date ));
    this.y.domain(d3Array.extent(this.data, (d) => d.value ));
    // Configure the X Axis
    this.svg.append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x));
    // Configure the Y Axis
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y));
  }

  private drawLineAndPath() {
    this.line = d3Shape.line()
        .x( (d: any) => this.x(d.date) )
        .y( (d: any) => this.y(d.value) );
    // Configuring line path
    this.svg.append('path')
        .datum(this.data)
        .attr('class', 'line')
        .attr('d', this.line);
  }

  ngOnInit(): void {
    this.buildSvg();
    this.addXandYAxis();
    this.drawLineAndPath();
  }

}
