// components/ui/SensorGauges.jsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const RADIUS = 60;
const STROKE = 14;
const ARC_LENGTH = 188; 

const gaugeArc = (cx, cy) =>
  `M ${cx - RADIUS} ${cy} A ${RADIUS} ${RADIUS} 0 0 1 ${cx + RADIUS} ${cy}`;

const GaugeItem = ({ label, value, min = 0, max = 100, color }) => {
  const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const filled = ratio * ARC_LENGTH;
  const cx = 80;
  const cy = 90;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Svg width={160} height={110}>
        <Path
          d={gaugeArc(cx, cy)}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={STROKE}
          strokeLinecap={filled > 0 ? "round" : "butt"}
        />
        <Path
          d={gaugeArc(cx, cy)}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap={filled > 0 ? "round" : "butt"}
          strokeDasharray={`${filled} ${ARC_LENGTH}`}
        />
      </Svg>
      <Text style={styles.value}>{value??0}</Text>
    </View>
  );
};

export default function SensorGauges({ data }) {
  console.log("data",data)
  return (
    <View style={styles.row}>
      <GaugeItem label="Ph" value={data.ph} min={0} max={14} color="#E57373"/>
      <GaugeItem label="Temperature" value={data.temperature} min={0} max={50} color="#64B5F6"/>
      <GaugeItem label="Humidity" value={data.humidity*100} min={0} max={100} color="#4DB6AC"/>
      <GaugeItem label="Conductivity"value={data.conductivity}min={0} max={200} color="#E040FB"/>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 8,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    margin: 6,
    width: 150,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: -20,
  },
});