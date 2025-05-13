import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { DynamicIcon } from 'lucide-react/dynamic';
import { useAxios } from '@/hooks/usePrivateAxios';
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";


import { Modal } from 'antd';
const { confirm } = Modal;
const { info } = Modal;


export const GestionarReservas = () => {
    const [data, setData] = useState<any[]>([]);
    const api = useAxios();
    const [contador, useContador] = useState<number>(1);
    const [cargando, setCargando] = useState<boolean>(false);
    const navigate = useNavigate();




    useEffect(() => {
        const fetchReservas = async () => {
            setCargando(true);
            try {
                const response = await api.get('/reservas/');
                const data = response.data.data;
                setData(data);
            } catch (err) {
                console.error('Error al cargar las reservas:', err);
                toast.error('Error al cargar las reservas', {
                    description: 'Hubo un error al cargar las reservas. Por favor, inténtalo de nuevo más tarde.',
                    duration: 5000,
                    position: 'top-right',
                    descriptionClassName: 'font-bold color-primary',
                    icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                })
            } finally {
                setCargando(false);
            }
        };

        fetchReservas();

    }, [contador])

    type Reserva = {
        nFolio: number,
        nEspacio: number,
        dFechaInicio: string,
        dFechaFin: string,
        nUsuario: number,
        cNombreSolicitante: string,
        cDepartamento: string,
        cDuracionEstimada: string,
        cDescripcion: string,
        estatus: {
            nEstatus: number,
            cEstatus: string,
            cColor: string,
        },
        espacio: {
            nEspacio: number,
            cEspacio: string,
            cDescripcion: string,
            cUbicacion: string,
            nCapacidad: number,
            bActivo: boolean,
        },
        usuario: {
            nUsuario: number,
            cNombre: string,
        },
    }

    const columns: ColumnDef<Reserva>[] = [
        {
            accessorKey: "nFolio",
            header: "Folio",
        },
        {
            accessorKey: "espacio.cEspacio",
            header: "Nombre del Espacio",
        },
        {
            accessorKey: "dFechaInicio",
            header: "Fecha Inicio",
            cell: ({ row }) => {
                const fechaFormat = new Date(row.getValue("dFechaInicio"))
                const options: Intl.DateTimeFormatOptions = {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                }
                const formatted = fechaFormat.toLocaleDateString("en-US", options)


                return <div className=" font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "dFechaFin",
            header: "Fecha Fin",
            cell: ({ row }) => {
                const fechaFormat = new Date(row.getValue("dFechaFin"))
                const options: Intl.DateTimeFormatOptions = {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                }
                const formatted = fechaFormat.toLocaleDateString("en-US", options)


                return <div className=" font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "cNombreSolicitante",
            header: "Solicitante",
        },
        {
            accessorKey: "cDepartamento",
            header: "Departamento",
        },
        {
            accessorKey: "estatus.cEstatus",
            header: "Estatus",
            cell: ({ row }) => {
                return (
                    <Badge variant="outline" style={{ backgroundColor: row.original.estatus.cColor, marginLeft: 4 }} >{row.original.estatus.cEstatus}</Badge>

                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const nFolio = row.original.nFolio

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { editarSolicitud(nFolio) }}>Ver/Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { aprovarSolicitudReserva(nFolio) }}>Aprovar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { rechazarSolicitudReserva(nFolio) }}>Rechazar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { eliminarSolicitudReserva(nFolio) }}>Eliminar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { abrirHistorialCambios(nFolio) }}>Ver historial de cambios</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];

    function aprovarSolicitudReserva(nFolio: number) {
        confirm({
            title: '¿Estas seguro que deseas aprovar?',
            okText: 'Continuar',
            cancelText: 'Cancelar',
            content:
                <div>
                    ¿Estás seguro de que deseas <strong>Aprovar</strong> la solicitud de reserva?
                    <br />
                </div>,
            async onOk() {
                try {
                    await api.put(`/reservas/aprovar/${nFolio}`)

                    toast.success('Solicitud aprobada correctamente', {
                        description: `La solicitud de reserva ${nFolio} ha sido aprobada.`,
                        duration: 5000,
                        position: 'top-right',
                        descriptionClassName: 'font-bold color-primary',
                        icon: <DynamicIcon name="check" size={16} className="text-green-500" />,
                    })
                    useContador(contador + 1);

                } catch (error: any) {
                    console.error('Error al aprovar:', error);
                    toast.error('Error al aprovar la reserva', {
                        description: error.response.data.message,
                        duration: 5000,
                        position: 'top-right',
                        descriptionClassName: 'font-bold color-primary',
                        icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                    })
                }
            },
        });
    }

    function rechazarSolicitudReserva(nFolio: number) {
        confirm({
            title: '¿Estas seguro que deseas rechazar?',
            okText: 'Continuar',
            cancelText: 'Cancelar',
            content:
                <div>
                    ¿Estás seguro de que deseas <strong>Rechazar</strong> la solicitud de reserva?
                    <br />
                </div>,
            onOk() {
                return api.put(`/reservas/rechazar/${nFolio}`)
                    .then(() => {
                        toast.success('Solicitud rechazada correctamente', {
                            description: `La solicitud de reserva ${nFolio} a sido rechazada.`,
                            duration: 5000,
                            position: 'top-right',
                            descriptionClassName: 'font-bold color-primary',
                            icon: <DynamicIcon name="check" size={16} className="text-green-500" />,
                        })

                        useContador(contador + 1);
                    })
                    .catch((error) => {
                        console.error('Error al actualizar:', error);
                        toast.error('Error al actualizar la reserva', {
                            description: 'Hubo un error al actualizar la reserva. Por favor, inténtalo de nuevo más tarde.',
                            duration: 5000,
                            position: 'top-right',
                            descriptionClassName: 'font-bold color-primary',
                            icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                        })
                    });
            },
        });
    }

    function eliminarSolicitudReserva(nFolio: number) {
        confirm({
            title: '¿Estas seguro que deseas eliminar?',
            okText: 'Continuar',
            cancelText: 'Cancelar',
            content:
                <div>
                    ¿Estás seguro de que deseas <strong>Eliminar</strong> la solicitud de reserva?
                    <br />
                </div>,
            onOk() {
                return api.delete(`/reservas/eliminar/${nFolio}`)
                    .then(() => {
                        toast.success('Solicitud eliminada correctamente', {
                            description: `La solicitud de reserva ${nFolio} ha sido eliminada.`,
                            duration: 5000,
                            position: 'top-right',
                            descriptionClassName: 'font-bold color-primary',
                            icon: <DynamicIcon name="check" size={16} className="text-green-500" />,
                        });

                        useContador(contador + 1);
                    })
                    .catch((error) => {
                        console.error('Error al eliminar:', error);
                        toast.error('Error al eliminar la reserva', {
                            description: 'Hubo un error al eliminar la reserva. Por favor, inténtalo de nuevo más tarde.',
                            duration: 5000,
                            position: 'top-right',
                            descriptionClassName: 'font-bold color-primary',
                            icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                        });
                    });
            },
        });
    }

    function abrirHistorialCambios(nFolio: number) {
        api.get(`/historialcambios/${nFolio}`)
            .then((res) => {
                const cambios = res.data.data;

                info({
                    title: 'Historial de Cambios',
                    content: (
                        <div>
                            <Separator />
                            <table className="table-auto w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Acción</th>
                                        <th className="px-4 py-2">Usuario</th>
                                        <th className="px-4 py-2">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cambios.map((cambio: any, index: number) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{cambio.cAccion}</td>
                                            <td className="border px-4 py-2">{cambio.usuario.cNombres}</td>
                                            <td className="border px-4 py-2">{new Date(cambio.dFecha).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Separator />
                        </div>
                    ),
                    okText: 'Cerrar',
                    cancelText: 'Cancelar',
                });

            })
            .catch((error) => {
                console.error('Error al eliminar:', error);
                toast.error('Error al eliminar la reserva', {
                    description: 'Hubo un error al eliminar la reserva. Por favor, inténtalo de nuevo más tarde.',
                    duration: 5000,
                    position: 'top-right',
                    descriptionClassName: 'font-bold color-primary',
                    icon: <DynamicIcon name="x" size={16} className="text-red-500" />,
                });
            });
    }

    function editarSolicitud(nFolio: number) {
        navigate(`/reservas/solicitud/${nFolio}`);
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold text-center my-4">Gestón de solicitudes de reserva</h1>
            <Separator />
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {(() => {
                        switch (true) {
                            case table.getRowModel().rows?.length > 0:
                                return table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ));
                            case cargando:
                                return (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            <div className="flex items-center justify-center">
                                                <LoadingSpinner className="animate-spin" size={24} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            default:
                                return (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Sin resultados
                                        </TableCell>
                                    </TableRow>
                                );
                        }
                    })()}
                </TableBody>
            </Table>
        </div>
    );
};

export default GestionarReservas;
