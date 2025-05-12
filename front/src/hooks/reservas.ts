import { useState, useEffect } from 'react';
import { useAxios } from './usePrivateAxios';

export function useMisReservas() {
    const [misReservas, setMisReservas] = useState<any[]>([]);
    const [cargando, setCargando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const apiInstance = useAxios();

    useEffect(() => {
        const fetchReservas = async () => {
            setCargando(true);
            try {
                const response = await apiInstance.get('/reservas/mis-reservas');
                setMisReservas(response.data.data);
            } catch (err) {
                setError('Error al cargar los Reservas');
            } finally {
                setCargando(false);
            }
        };

        fetchReservas();

        // Cleanup
        return () => {
            setMisReservas([]);
            setCargando(false);
            setError(null);
        };
    }, []);

    return { misReservas, cargando, error };
}
