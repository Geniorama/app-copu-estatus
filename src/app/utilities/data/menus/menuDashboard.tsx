import { ReactNode } from "react"

interface MenuItemProps {
    name: string
    path?: string
    icon?: ReactNode
}

export const menuDashboard:MenuItemProps[] = [
    {
        name: 'Dashboard',
        path: '/dashboard'
    },

    {
        name: 'Servicios',
        path: '/dashboard/servicios'
    },

    {
        name: 'Contenidos',
        path: '/dashboard/contenidos'
    },

    {
        name: 'Compañias',
        path: '/dashboard/companias'
    },

    {
        name: 'Usuarios',
        path: '/dashboard/usuarios'
    },

    {
        name: 'Mi perfil',
        path: '/dashboard/perfil'
    }
]