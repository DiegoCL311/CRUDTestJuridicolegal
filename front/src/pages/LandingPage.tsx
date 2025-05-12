//import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotebookPen, Eye } from "lucide-react";

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:border-2 hover:bg-muted/70 transition-all duration-300 ease-in-out" onClick={() => navigate('/reservas/solicitud')}>
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <h1 className="text-2xl font-bold">Nueva Solicitud de Reserva </h1>
                        <NotebookPen className="ml-4 h-12 w-12" />

                    </div>
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:border-2 hover:bg-muted/70 transition-all duration-300 ease-in-out" onClick={() => navigate('/reservas/consultar')}>
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <h1 className="text-2xl font-bold">Consultar Reservas </h1>
                        <Eye className="ml-4 h-12 w-12" />

                    </div>
                </div>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min aspect-video" />
        </div>
    );
}