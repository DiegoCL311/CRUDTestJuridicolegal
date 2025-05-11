import { useState, useEffect } from 'react';
import { useAxios } from './usePrivateAxios';

export function useEspacios() {
    const [espacios, setEspacios] = useState<any[]>([]);
    const [cargando, setCargando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const apiInstance = useAxios();

    useEffect(() => {
        const fetchEspacios = async () => {
            setCargando(true);
            try {
                const response = await apiInstance.get('/espacios');
                setEspacios(response.data.data);
            } catch (err) {
                setError('Error al cargar los espacios');
            } finally {
                setCargando(false);
            }
        };

        fetchEspacios();

        // Cleanup
        return () => {
            setEspacios([]);
            setCargando(false);
            setError(null);
        };
    }, []);

    return { espacios, cargando, error };
}
