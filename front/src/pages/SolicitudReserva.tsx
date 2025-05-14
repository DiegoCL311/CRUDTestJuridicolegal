// SolicitudReserva.tsx
import React, { useEffect, useState } from 'react';
import { useForm, useController, useWatch } from 'react-hook-form';
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
import { DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

import { z } from '@/lib/es-zod'
import dayjs, { Dayjs } from 'dayjs';

import { Modal } from 'antd';
const { confirm } = Modal;


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

export function SolicitudReserva(): React.JSX.Element {
    const form = useForm<FormData>({ resolver: zodResolver(schema) });
    const { nFolio } = useParams();
    const { espacios, error } = useEspacios();
    const navigate = useNavigate();
    const { field: fieldInicio } = useController({ name: 'dFechaInicio', control: form.control });
    const { field: fieldFin } = useController({ name: 'dFechaFin', control: form.control });
    const api = useAxios();
    const nEspacioSeleccionado = useWatch({ control: form.control, name: 'nEspacio' });
    const [disabledDates, setDisabledDates] = useState<DisabledRange[]>([]);
    const [disabledbutton, setDisabledbutton] = useState(false);
    const { errors } = form.formState;
    const [modo, setModo] = useState<'editar' | 'nuevo' | 'ver'>('nuevo');
    const [primeraCarga, setPrimera] = useState(true);
    const [estatus, setEstatus] = useState<any>(null);

    useEffect(() => {
        if (error) {
            toast.error('Error al cargar los espacios', {
                description: 'Hubo un error al cargar los espacios. Por favor, inténtalo de nuevo más tarde.',
                duration: 5000,
                position: 'top-right',
                descriptionClassName: 'font-bold color-primary',
                icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
            })
            setDisabledbutton(true);
        }
    }, [error]);

    useEffect(() => {
        if (!nFolio) return;

        api.get(`/reservas/obtener-reserva/${nFolio}`)
            .then(res => {
                const { nEspacio,
                    dFechaInicio,
                    dFechaFin,
                    cNombreSolicitante,
                    cDepartamento,
                    cDuracionEstimada,
                    cDescripcion,
                    nEstatus,
                    estatus } = res.data.data

                form.setValue('nEspacio', nEspacio);
                form.setValue('dFechaInicio', new Date(dFechaInicio));
                form.setValue('dFechaFin', new Date(dFechaFin));
                form.setValue('cNombreSolicitante', cNombreSolicitante);
                form.setValue('cDepartamento', cDepartamento);
                form.setValue('cDuracionEstimada', cDuracionEstimada);
                form.setValue('cDescripcion', cDescripcion);

                if (nEstatus == 1) {
                    setModo('editar');
                } else {
                    setModo('ver');
                }
                setEstatus(estatus);

            })
            .catch(err => {
                console.error('Error al obtener datos de la reserva', err)
                toast.error('Error al obtener datos de la reserva', {
                    description: 'Hubo un error al obtener los datos de la reserva. Por favor, inténtalo de nuevo más tarde.',
                    duration: 5000,
                    position: 'top-right',
                    descriptionClassName: 'font-bold color-primary',
                    icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                })
            });
    }, [nFolio]);






    useEffect(() => {
        if (!nEspacioSeleccionado) {
            return;
        }
        if (primeraCarga) {
            setPrimera(false);
        } else {
            form.resetField('dFechaInicio');
            form.resetField('dFechaFin');
        }

        api.get(`/reservas/obtenerReservasAprovadasByespacio/${nEspacioSeleccionado}`)
            .then(res => {
                const fechas: DisabledRange[] = res.data.data.map((item: { dFechaInicio: string; dFechaFin: string }) => ({
                    start: dayjs(new Date(item.dFechaInicio)),
                    end: dayjs(new Date(item.dFechaFin))
                }));
                //console.log('Fechas a deshabilitar:', fechas);
                setDisabledDates(fechas);
            })
            .catch(_err => {
                toast.error('Error al obtener fechas ocupadas')
                setDisabledbutton(true);
            });

        // Resetear campos de fecha al cambiar el espacio seleccionado, pero no la primera carga si es actualizar

    }, [nEspacioSeleccionado]);

    // Enviar nueva reserva
    async function onSubmitNuevo(data: FormData) {
        console.log('Envío correcto:', data);


        setDisabledbutton(true);
        confirm({
            title: '¿Estas seguro que deseas guardar?',
            icon: <ExclamationCircleFilled />,
            okText: 'Continuar',
            cancelText: 'Cancelar',
            content:
                <div>
                    ¿Estás seguro de que deseas enviar la solicitud de reserva?
                    <br />
                    Verifica que la información sea correcta antes de continuar.
                    <p><strong>Espacio: </strong>{espacios?.find(e => e.nEspacio === nEspacioSeleccionado)?.cEspacio}</p>
                    <p><strong>Fecha y hora:</strong> {fieldInicio.value?.toLocaleString()} - {fieldFin.value?.toLocaleString()}</p>
                    <p><strong>Solicitante:</strong> {form.getValues('cNombreSolicitante')}</p>
                    <p><strong>Departamento:</strong> {form.getValues('cDepartamento')}</p>
                    <p><strong>Duración: </strong>{form.getValues('cDuracionEstimada')}</p>
                    <p><strong>Descripción: </strong>{form.getValues('cDescripcion')}</p>
                    <p><strong>Recuerda que la solicitud está sujeta a aprobación por parte del administrador.</strong></p>
                </div>,
            async onOk() {

                try {
                    const res = await api.post('/reservas/registrar', data);

                    toast.success('Solicitud enviada correctamente', {
                        description: `La solicitud de reserva ha sido enviada. Tu numero de folio es: ${res.data.data.nFolio}`,
                        duration: 5000,
                        position: 'top-right',
                        descriptionClassName: 'font-bold color-primary',
                        icon: <DynamicIcon name="check" size={16} className="text-green-500" />,
                    })

                    navigate('/reservas/consultar');

                } catch (error) {
                    console.error('Error al enviar la solicitud:', error);
                    toast.error('Error al enviar la solicitud', {
                        description: 'Hubo un error al enviar la solicitud de reserva. Por favor, inténtalo de nuevo más tarde.',
                        duration: 5000,
                        position: 'top-right',
                        descriptionClassName: 'font-bold color-primary',
                        icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                    })
                }
            },
            onCancel() {
                setDisabledbutton(false);
            },
        });
    }

    // Actualizar reserva
    async function onSubmitActualizar(data: FormData) {
        console.log('Envío correcto:', data);
        setDisabledbutton(true);
        confirm({
            title: '¿Estas seguro que deseas actualizar?',
            icon: <ExclamationCircleFilled />,
            okText: 'Continuar',
            cancelText: 'Cancelar',
            content:
                <div>
                    ¿Estás seguro de que deseas <strong>actualizar</strong> la solicitud de reserva?
                    <br />
                    Verifica que la información sea correcta antes de continuar.
                    <p><strong>Espacio: </strong>{espacios?.find(e => e.nEspacio === nEspacioSeleccionado)?.cEspacio}</p>
                    <p><strong>Fecha y hora:</strong> {fieldInicio.value?.toLocaleString()} - {fieldFin.value?.toLocaleString()}</p>
                    <p><strong>Solicitante:</strong> {form.getValues('cNombreSolicitante')}</p>
                    <p><strong>Departamento:</strong> {form.getValues('cDepartamento')}</p>
                    <p><strong>Duración: </strong>{form.getValues('cDuracionEstimada')}</p>
                    <p><strong>Descripción: </strong>{form.getValues('cDescripcion')}</p>
                    <p><strong>Recuerda que la solicitud está sujeta a aprobación por parte del administrador.</strong></p>
                </div>,
            onOk() {
                return api.put(`/reservas/actualizar/${nFolio}`, data).then((res) => {
                    toast.success('Solicitud actualizada correctamente', {
                        description: `La solicitud de reserva ${res.data.data.nFolio} a sido actualizada.`,
                        duration: 5000,
                        position: 'top-right',
                        descriptionClassName: 'font-bold color-primary',
                        icon: <DynamicIcon name="check" size={16} className="text-green-500" />,
                    })

                    navigate('/reservas', { replace: true });


                }).catch((error) => {
                    console.error('Error al actualizar:', error);
                    toast.error('Error al actualizar la reserva', {
                        description: 'Hubo un error al actualizar la reserva. Por favor, inténtalo de nuevo más tarde.',
                        duration: 5000,
                        position: 'top-right',
                        descriptionClassName: 'font-bold color-primary',
                        icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                    })
                })
            },
            onCancel() {
                setDisabledbutton(false);
            },
        });
    }

    // Enviar nueva reserva
    async function eliminarReserva() {
        setDisabledbutton(true);
        confirm({
            title: '¿Estas seguro que deseas eliminar la reserva?',
            icon: <DeleteFilled />,
            okText: 'Eliminar',
            cancelText: 'Cancelar',
            onOk() {
                return api.delete(`/reservas/eliminar/${nFolio}`).then((_res) => {
                    toast.success('Solicitud de reserva eliminada correctamente', {
                        duration: 5000,
                        position: 'top-right',
                        descriptionClassName: 'font-bold color-primary',
                        icon: <DynamicIcon name="check" size={16} className="text-green-500" />,
                    })

                    navigate('/reservas', { replace: true });

                }).catch((error) => {
                    console.error('Error al enviar la solicitud:', error);
                    toast.error('Error al enviar la solicitud', {
                        description: 'Hubo un error al enviar la solicitud de reserva. Por favor, inténtalo de nuevo más tarde.',
                        duration: 5000,
                        position: 'top-right',
                        descriptionClassName: 'font-bold color-primary',
                        icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                    })
                })
            },
            onCancel() {
                setDisabledbutton(false);
            },
        });
    }



    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className=" gap-2">
                <div>

                    {modo === 'nuevo' && <h1 className="text-2xl font-bold text-center my-4">Nueva Solicitud de Reserva</h1>}
                    {modo === 'editar' && <h1 className="text-2xl font-bold text-center my-4">Modificar Solicitud de Reserva {nFolio}
                        <Badge variant="outline" style={{ backgroundColor: estatus.cColor, marginLeft: 4 }} >{estatus.cEstatus}</Badge>
                        <Button variant={'destructive'} className='float-right hover:cursor-pointer' onClick={() => { eliminarReserva() }}>Eliminar</Button>
                    </h1>}
                    {modo === 'ver' && <h1 className="text-2xl font-bold text-center my-4">Ver Solicitud de Reserva  <Badge variant="outline" style={{ backgroundColor: estatus.cColor }} >{estatus.cEstatus}</Badge></h1>}
                </div>

            </div>

            <Separator />
            {/* Formulario con onSubmit directo */}
            <Form {...form}>
                <form onSubmit={modo == 'nuevo' ? form.handleSubmit(onSubmitNuevo) : form.handleSubmit(onSubmitActualizar)} className="space-y-4">
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
                                    onClick={() => {
                                        if (modo == 'ver') return;
                                        field.onChange(espacio.nEspacio)
                                    }}
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
                        {!nEspacioSeleccionado ? (
                            <p className="text-sm text-muted-foreground">Seleccione un espacio para habilitar el calendario</p>
                        ) : (
                            <DateTimePicker
                                value={[fieldInicio.value ? dayjs(fieldInicio.value) : null, fieldFin.value ? dayjs(fieldFin.value) : null]}
                                disabledRanges={disabledDates}
                                onCalendarChange={(dates: (Dayjs | null)[]) => {
                                    // Convertir Dayjs a Date para Zod
                                    const [dFechaInicio, dFechaFin] = dates || [null, null];

                                    //console.log('Fechas seleccionadas inicio:', dFechaInicio, dFechaInicio?.toString());
                                    //console.log('Fechas seleccionadas fin:', dFechaFin, dFechaFin?.toString());

                                    fieldInicio.onChange(dFechaInicio?.toDate());
                                    fieldFin.onChange(dFechaFin?.toDate());
                                }}
                                disabled={modo == 'ver'}
                            />
                        )

                        }
                    </div>

                    {/* Detalles de la reserva */}
                    <FormField name="cNombreSolicitante" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="cNombreSolicitante">Nombre del solicitante</Label>
                            <FormControl>
                                <Input id="cNombreSolicitante" placeholder="Nombre..." {...field} disabled={modo == 'ver'} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="cDepartamento" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="cDepartamento">Departamento</Label>
                            <FormControl>
                                <Input id="cDepartamento" placeholder="Departamento..." {...field} disabled={modo == 'ver'} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="cDuracionEstimada" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="cDuracionEstimada">Duración estimada</Label>
                            <FormControl>
                                <Input id="cDuracionEstimada" type="text" placeholder="1 hora... 2 horas..." {...field} disabled={modo == 'ver'} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="cDescripcion" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="cDescripcion">Descripción del evento</Label>
                            <Label htmlFor="cDescripcion" className="text-xs">Breve resumen del propósito</Label>
                            <FormControl>
                                <Textarea id="cDescripcion" {...field} disabled={modo == 'ver'} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {modo == 'nuevo' && <Button type="submit" disabled={disabledbutton} className='float-right'>Solicitar</Button>}
                    {modo == 'editar' && <Button type="submit" disabled={disabledbutton} className='float-right'>Actualizar</Button>}
                </form>
            </Form>

        </div >
    );
}
