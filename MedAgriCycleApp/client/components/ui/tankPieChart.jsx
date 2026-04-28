import React from "react";
import { View } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import * as d3 from "d3-shape";

export default function TankPieChart({ data }) {
  if (!data || data.length === 0) return null;

  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  const pieGenerator = d3
    .pie()
    .value((d) => d.value)
    .sort(null);

  const arcGenerator = d3
    .arc()
    .outerRadius(radius)
    .innerRadius(50); // Donut léger

  const labelArc = d3
    .arc()
    .outerRadius(radius - 30)
    .innerRadius(radius - 30);

  const pieData = pieGenerator(data);

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={width} height={height}>
        <G x={width / 2} y={height / 2}>
          {pieData.map((slice, index) => {
            const [labelX, labelY] = labelArc.centroid(slice);

            return (
              <G key={index}>
                <Path d={arcGenerator(slice)} fill={slice.data.color} />

                {/* Label : pourcentage */}
                <SvgText
                  x={labelX}
                  y={labelY}
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {slice.data.percentage}%
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}
