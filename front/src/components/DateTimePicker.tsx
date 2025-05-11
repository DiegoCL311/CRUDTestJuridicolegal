import React, { useState, useMemo } from 'react';
import { DatePicker, Space } from 'antd';
import type { GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
type DisabledRange = { start: Dayjs; end: Dayjs };


interface DateTimePickerProps {
    disabledRanges: DisabledRange[];
    onCalendarChange: (dates: [Dayjs | null, Dayjs | null]) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ disabledRanges = [], onCalendarChange }) => {
    const [selectedDates, setSelectedDates] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

    // Calcula rangos dinámicos incluyendo bloqueo hacia atrás y hacia adelante
    const dynamicRanges = useMemo(() => {
        const [startSel] = selectedDates;
        if (startSel) {
            const anteriores = disabledRanges.filter(r => r.end.isBefore(startSel));
            const posteriores = disabledRanges.filter(r => r.start.isAfter(startSel));
            const ranges = [...disabledRanges];
            if (anteriores.length) {
                const prev = anteriores.reduce((max, r) => r.end.isAfter(max.end) ? r : max);
                ranges.push({ start: dayjs('0000-01-01 00:00', 'YYYY-MM-DD HH:mm'), end: prev.end });
            }
            if (posteriores.length) {
                const next = posteriores.reduce((min, r) => r.start.isBefore(min.start) ? r : min);
                ranges.push({ start: next.start, end: dayjs('9999-12-31 23:59', 'YYYY-MM-DD HH:mm') });
            }
            return ranges;
        }
        return disabledRanges;
    }, [selectedDates]);

    // Deshabilita días según cualquier rango dinámico
    const disabledDate = (current: Dayjs) => !!current && dynamicRanges.some(r => current.isAfter(r.start, 'day') && current.isBefore(r.end, 'day'));

    // Deshabilita horas y minutos según rangos y tipo (inicio/fin)
    const disabledTimePicker: RangePickerProps['disabledTime'] = (current, type) => {
        if (!current) return { disabledHours: () => [], disabledMinutes: () => [], disabledSeconds: () => [] };
        const ranges = type === 'start' ? dynamicRanges : dynamicRanges;
        const horasDes: Set<number> = new Set();
        ranges.forEach(r => {
            const mismaInicio = current.isSame(r.start, 'day');
            const mismaFin = current.isSame(r.end, 'day');
            const entre = current.isAfter(r.start, 'day') && current.isBefore(r.end, 'day');
            if (mismaInicio && mismaFin) { for (let h = r.start.hour() + 1; h < r.end.hour(); h++) horasDes.add(h); }
            else if (mismaInicio) { for (let h = r.start.hour() + 1; h < 24; h++) horasDes.add(h); }
            else if (mismaFin) { for (let h = 0; h < r.end.hour(); h++) horasDes.add(h); }
            else if (entre) { for (let h = 0; h < 24; h++) horasDes.add(h); }
        });
        ranges.forEach(r => {
            if (type === 'end' && current.isSame(r.end, 'day')) horasDes.add(r.end.hour());
            if (type === 'start' && current.isSame(r.start, 'day')) horasDes.add(r.start.hour());
        });
        const horasArray = Array.from(horasDes).sort((a, b) => a - b);
        const disabledMinutes = (hour: number) => {
            const mins: Set<number> = new Set();
            ranges.forEach(r => {
                const mismaInicio = current.isSame(r.start, 'day');
                const mismaFin = current.isSame(r.end, 'day');
                if (mismaInicio && hour === r.start.hour()) { for (let m = r.start.minute() + 1; m < 60; m++) mins.add(m); }
                if (mismaFin && hour === r.end.hour()) { for (let m = 0; m < r.end.minute(); m++) mins.add(m); }
            });
            return Array.from(mins).sort((a, b) => a - b);
        };
        return { disabledHours: () => horasArray, disabledMinutes, disabledSeconds: () => [] };
    };

    return (
        <Space direction="vertical" size={12}>
            <DatePicker.RangePicker
                disabledDate={disabledDate}
                disabledTime={disabledTimePicker}
                showTime={{ hideDisabledOptions: false }}
                format="YYYY-MM-DD HH:00"
                onCalendarChange={(dates) => setSelectedDates(dates as [Dayjs | null, Dayjs | null])}
                onChange={(dates) => {
                    const pick = dates as [Dayjs | null, Dayjs | null];
                    setSelectedDates(pick);
                    onCalendarChange?.(pick);
                }}
                minDate={dayjs(dayjs(), 'YYYY-MM-DD HH:mm')}
            />
        </Space>
    );
};