//import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookPen, Eye } from "lucide-react";
import { RelojConRangos } from '@/components/RelojConRangos';
import { useEspaciosConReservasHoy } from '@/hooks/espacios';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { DynamicIcon } from 'lucide-react/dynamic';

export function LandingPage() {
    const navigate = useNavigate();
    const { espacios } = useEspaciosConReservasHoy();


    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:border-2 hover:bg-muted/70 transition-all duration-300 ease-in-out" onClick={() => navigate('/reservas/solicitud')}>
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <h1 className="text-2xl font-bold text-center">Nueva Solicitud de Reserva </h1>
                        <NotebookPen className="ml-4 h-12 w-12" />
                    </div>
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:border-2 hover:bg-muted/70 transition-all duration-300 ease-in-out" onClick={() => navigate('/reservas/consultar')}>
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <h1 className="text-2xl font-bold text-center">Consultar Reservas </h1>
                        <Eye className="ml-4 h-12 w-12" />
                    </div>
                </div>
            </div>

            <div className="min-h-[100vh] flex-1 flex-col gap-12 rounded-xl bg-muted/50 md:min-h-min aspect-video" >
                <h1 className="text-2xl  text-center my-4">Horarios ocupados hoy:</h1>
                <Separator />

                <div className="grid auto-rows-min gap-4 md:grid-cols-2 overflow-visible">
                    {espacios.map((espacio: any) => (
                        <div className="flex flex-col items-center justify-center text-muted-foreground m-6 ">
                            <Label>{espacio.cEspacio}</Label>
                            <DynamicIcon name={espacio.cIcono} size={32} className='my-6' />
                            <RelojConRangos ranges={espacio.rangosOcupados || []} />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}