import { ReactNode } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faCube, faPhotoFilm, faBuilding, faUserGroup, faUser } from "@fortawesome/free-solid-svg-icons"

interface MenuItemProps {
    name: string
    path?: string
    icon?: ReactNode
}

export const menuDashboard:MenuItemProps[] = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: <FontAwesomeIcon icon={faHouse} />
    },

    {
        name: 'Servicios',
        path: '/dashboard/servicios',
        icon: <FontAwesomeIcon icon={faCube} />
    },

    {
        name: 'Contenidos',
        path: '/dashboard/contenidos',
        icon: <FontAwesomeIcon icon={faPhotoFilm} />
    },

    {
        name: 'Compañias',
        path: '/dashboard/companias',
        icon: <FontAwesomeIcon icon={faBuilding} />
    },

    {
        name: 'Usuarios',
        path: '/dashboard/usuarios',
        icon: <FontAwesomeIcon icon={faUserGroup} />
    },

    {
        name: 'Mi perfil',
        path: '/dashboard/perfil',
        icon: <FontAwesomeIcon icon={faUser} />
    }
]