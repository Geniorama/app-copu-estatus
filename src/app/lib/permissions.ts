export const permissions = {
    admin: {
      servicios: {
        canView: true,
        canEdit: true,
        canDelete: true,
      },
      contenidos: {
        canView: true,
        canEdit: true,
        canDelete: true,
      },
      usuarios: {
        canView: true,
        canEdit: true,
        canDelete: true,
      },
      companias: {
        canView: true,
        canEdit: true,
        canDelete: true,
      },
    },
    cliente: {
      servicios: {
        canView: true,
        canEdit: false,
        canDelete: false,
      },
      contenidos: {
        canView: true,
        canEdit: false,
        canDelete: false,
      },
      usuarios: {
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      companias: {
        canView: true,
        canEdit: false,
        canDelete: false,
      },
    },
    guest: {
      servicios: {
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      contenidos: {
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      usuarios: {
        canView: false,
        canEdit: false,
        canDelete: false,
      },
      companias: {
        canView: false,
        canEdit: false,
        canDelete: false,
      },
    },
  };
  