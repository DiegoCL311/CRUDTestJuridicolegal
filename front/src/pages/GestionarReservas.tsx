import { Separator } from '@/components/ui/separator';
import { useMisReservas } from '@/hooks/reservas';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DynamicIcon } from 'lucide-react/dynamic';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';


export const GestionarReservas = () => {
    const { misReservas, cargando, } = useMisReservas();
    const navigate = useNavigate();

    if (cargando) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <LoadingSpinner />
            </div>
        );

    }
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold text-center my-4">Mis Solicitudes de Reserva</h1>
            <Separator />

            <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
                {misReservas?.map(reserva => (
                    <div key={reserva.nFolio}
                        className={`flex flex-col aspect-video rounded-xl bg-muted/100  hover:border-3 hover:bg-muted/1 transition-all duration-300 ease-in-out p-4 gap-2 cursor-pointer`}
                        onClick={() => navigate(`/reservas/solicitud/${reserva.nFolio}`)}
                    >
                        <Label className="justify-center">Reserva {reserva.nFolio}
                            <Badge variant="outline" style={{ backgroundColor: reserva.estatus.cColor }} >{reserva.estatus.cEstatus}</Badge>
                        </Label>
                        <Label className="justify-center">Lugar: {reserva.espacio.cEspacio}</Label>
                        <DynamicIcon className="mx-auto my-1" name={reserva.espacio.cIcono} size={64} />
                        <Label className="justify-center text-xs text-justify mt-auto">Fecha inicio: {new Date(reserva.dFechaInicio).toLocaleDateString() + ' ' + new Date(reserva.dFechaInicio).toLocaleTimeString()}</Label>
                        <Label className="justify-center text-xs text-justify mt-auto">Fecha fin: {new Date(reserva.dFechaFin).toLocaleDateString() + ' ' + new Date(reserva.dFechaFin).toLocaleTimeString()}</Label>
                        <Label className="justify-center text-xs text-justify mt-auto">Estatus: {reserva.estatus.cEstatus}</Label>
                    </div>
                ))}
            </div>

        </div>

    )
}