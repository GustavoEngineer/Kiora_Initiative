import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBlocById } from '../../services/api'
import '../../styles/BlocDetail.css'

function BlocDetail() {
    const { blocId } = useParams()
    const navigate = useNavigate()
    const [bloc, setBloc] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBloc = async () => {
            try {
                const data = await getBlocById(blocId)
                setBloc(data)
            } catch (error) {
                console.error('Error al cargar el bloc:', error)
            } finally {
                setLoading(false)
            }
        }

        if (blocId) {
            fetchBloc()
        }
    }, [blocId])

    if (loading) return <div className="bloc-detail-loading">Cargando...</div>
    if (!bloc) return <div className="bloc-detail-error">Bloc no encontrado</div>

    return (
        <div className="bloc-detail-container">
            <button className="back-button" onClick={() => navigate('/')}>
                ← Volver
            </button>
            <div className="bloc-detail-header">
                <h1>{bloc.name}</h1>
            </div>
            <div className="bloc-detail-content">
                <p>Detalles del bloc aquí...</p>
                {/* Aquí iría la lista de tareas filtrada por blob, etc. */}
            </div>
        </div>
    )
}

export default BlocDetail
