import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

interface Range { dFechaInicio: string; dFechaFin: string; }
interface RelojConRangosProps { ranges: Range[]; size?: number; }

export function RelojConRangos({ ranges, size = 200 }: RelojConRangosProps): React.JSX.Element {
    const [value, setValue] = useState<Date>(new Date());

    useEffect(() => { const timer = setInterval(() => setValue(new Date()), 1000); return () => clearInterval(timer); }, []);

    const polarToCartesian = (cx: number, cy: number, r: number, angle: number): { x: number; y: number } => { const a = ((angle - 90) * Math.PI) / 180.0; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; };

    const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number): string => { const start = polarToCartesian(cx, cy, r, endAngle); const end = polarToCartesian(cx, cy, r, startAngle); const largeArc = endAngle - startAngle <= 180 ? 0 : 1; return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`; };

    const center = size / 2;
    const radius = center - 5;

    return (
        <div style={{ position: 'relative', width: size, height: size, overflow: 'visible' }}>
            <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
                {[...Array(24)].map((_, i) => {
                    const angle = i * (360 / 24);
                    const { x, y } = polarToCartesian(center, center, radius + 20, angle);
                    return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.04}>{i}</text>;
                })}
                {ranges.map((range, i) => {
                    const start = new Date(range.dFechaInicio);
                    const end = new Date(range.dFechaFin);
                    const startAngle = (start.getHours() + start.getMinutes() / 60) * (360 / 24);
                    const endAngle = (end.getHours() + end.getMinutes() / 60) * (360 / 24);
                    return <path key={i} d={describeArc(center, center, radius, startAngle, endAngle)} fill="none" stroke="#db1f32" strokeWidth={10} />;
                })}
            </svg>
            <Clock value={value} renderNumbers={false} size={size} renderSecondHand={false} />
        </div>
    );
}
