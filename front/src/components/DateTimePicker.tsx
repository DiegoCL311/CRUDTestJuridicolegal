import React, { useMemo } from 'react';
import { DatePicker, Space } from 'antd';
import type { GetProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
type DisabledRange = { start: Dayjs; end: Dayjs };

interface DateTimePickerProps {
    disabledRanges: DisabledRange[];
    value: [Dayjs | null, Dayjs | null];
    onCalendarChange: (dates: [Dayjs | null, Dayjs | null]) => void;
    disabled?: boolean;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ disabledRanges = [], value, onCalendarChange, disabled }) => {
    // Rango seleccionado controlado desde props
    const selectedDates = value;

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
    }, [selectedDates, disabledRanges]);

    // Deshabilita horas y minutos según rangos y tipo (inicio/fin)
    const disabledTimePicker: RangePickerProps['disabledTime'] = (current, type) => {
        if (!current) return { disabledHours: () => [], disabledSeconds: () => [] };
        const ranges = dynamicRanges;
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

        return { disabledHours: () => horasArray, disabledSeconds: () => [] };
    };

    // Deshabilita días si no queda ninguna hora disponible
    const disabledDate = (current: Dayjs) => {
        if (!current) return false;
        const { disabledHours } = disabledTimePicker(current, 'start', { from: current });
        //@ts-ignore
        const horasDes = disabledHours();
        return horasDes.length === 24;
    };

    return (
        <Space direction="vertical" size={12}>
            <DatePicker.RangePicker
                className='!bg-white !font-bold'
                value={selectedDates}
                disabledDate={disabledDate}
                disabledTime={disabledTimePicker}
                showTime={{ hideDisabledOptions: false }}
                format="YYYY-MM-DD HH:00"
                onCalendarChange={(dates) => onCalendarChange(dates as [Dayjs | null, Dayjs | null])}
                onChange={(dates) => onCalendarChange(dates as [Dayjs | null, Dayjs | null])}
                minDate={dayjs()}
                disabled={disabled}
            />
        </Space>
    );
};
