// SolicitudReserva.tsx
import React from 'react';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DateTimePicker } from '@/components/DateTimePicker';
import { Textarea } from '@/components/ui/textarea';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useEspacios } from '@/hooks/espacios';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAxios } from '@/hooks/usePrivateAxios';
import { InfoIcon } from 'lucide-react';

import { z } from '@/lib/es-zod'
import dayjs, { Dayjs } from 'dayjs';

// Definición de esquema con Zod
const schema = z.object({
    nEspacio: z.number().min(1),
    dFechaInicio: z.date(),
    dFechaFin: z.date(),
    cNombreSolicitante: z.string().min(4),
    cDepartamento: z.string().min(5),
    cDuracionEstimada: z.string().min(5),
    cDescripcion: z.string().min(5)
});

type FormData = z.infer<typeof schema>;

type DisabledRange = { start: Dayjs; end: Dayjs };

const disabledRanges: DisabledRange[] = [{
    start: dayjs('2025-05-10 13:00', 'YYYY-MM-DD HH:mm'), end: dayjs('2025-05-12 15:00', 'YYYY-MM-DD HH:mm')
}, { start: dayjs('2025-05-15 08:00', 'YYYY-MM-DD HH:mm'), end: dayjs('2025-05-15 12:00', 'YYYY-MM-DD HH:mm') }];

export function SolicitudReserva(): React.JSX.Element {
    const form = useForm<FormData>({ resolver: zodResolver(schema) });
    const api = useAxios();
    const { espacios } = useEspacios();
    const { field: fieldInicio } = useController({ name: 'dFechaInicio', control: form.control });
    const { field: fieldFin } = useController({ name: 'dFechaFin', control: form.control });
    const { errors } = form.formState;

    // Manejador de envío válido
    async function onSubmit(data: FormData) {
        console.log('Envío correcto:', data);
        const request = await api.post('/reservas/registrar', data)

        console.log(request.data);

    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold text-center my-4">Nueva Solicitud de Reserva</h1>
            <Separator />
            {/* Formulario con onSubmit directo */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Selección de espacio */}
                    <h2 className="text-xl font-bold text-center">Seleccione un espacio {errors.nEspacio && (
                        <Tooltip>
                            <TooltipTrigger>
                                <InfoIcon className="h-4 w-4" color="red" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm">{errors.nEspacio.message}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}</h2>
                    <FormField name="nEspacio" control={form.control} render={({ field }) => (
                        <div className="grid auto-rows-fr gap-4 md:grid-cols-4 items-stretch">
                            {espacios?.map(espacio => (
                                <div key={espacio.nEspacio}
                                    className={
                                        `flex flex-col h-full rounded-xl bg-muted/100 cursor-pointer hover:border-3 hover:scale-105 transition-all duration-300 ease-in-out p-4 ${field.value === espacio.nEspacio ? 'border-3 border-primary scale-105' : ''}`
                                    }
                                    onClick={() => field.onChange(espacio.nEspacio)}
                                >
                                    <Label className="justify-center">{espacio.cEspacio}</Label>
                                    <DynamicIcon className="mx-auto my-1" name={espacio.cIcono} size={64} />
                                    <Label className="justify-center my-1">Capacidad: {espacio.cCapacidad}</Label>
                                    <Label className="justify-center text-xs text-justify mt-auto">{espacio.cDescripcion}</Label>
                                </div>
                            ))}
                        </div>
                    )} />

                    {/* Selección de fecha y hora */}
                    <h2 className="text-xl font-bold text-center">Seleccione fecha y hora {(errors.dFechaInicio || errors.dFechaFin) && (
                        <Tooltip>
                            <TooltipTrigger>
                                <InfoIcon className="h-4 w-4" color="red" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm">{errors.dFechaInicio?.message || errors.dFechaFin?.message}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}</h2>
                    <div className="text-center">
                        <DateTimePicker
                            disabledRanges={disabledRanges}
                            onCalendarChange={(dates: (Dayjs | null)[]) => {
                                // Convertir Dayjs a Date para Zod
                                const [dFechaInicio, dFechaFin] = dates;
                                fieldInicio.onChange(dFechaInicio?.toDate());
                                fieldFin.onChange(dFechaFin?.toDate());
                            }}
                        />
                    </div>

                    {/* Detalles de la reserva */}
                    <FormField name="cNombreSolicitante" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="cNombreSolicitante">Nombre del solicitante</Label>
                            <FormControl>
                                <Input id="cNombreSolicitante" placeholder="Nombre..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="cDepartamento" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="cDepartamento">Departamento</Label>
                            <FormControl>
                                <Input id="cDepartamento" placeholder="Departamento..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="cDuracionEstimada" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="cDuracionEstimada">Duración estimada</Label>
                            <FormControl>
                                <Input id="cDuracionEstimada" type="text" placeholder="1 hora... 2 horas..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="cDescripcion" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="cDescripcion">Descripción del evento</Label>
                            <Label htmlFor="cDescripcion" className="text-xs">Breve resumen del propósito</Label>
                            <FormControl>
                                <Textarea id="cDescripcion" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Botón de envío */}
                    <Button type="submit" className="float-right">Solicitar</Button>
                </form>
            </Form>
        </div >
    );
}
