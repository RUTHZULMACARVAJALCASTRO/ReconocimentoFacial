export function findPermission(name: string) {
    const permisosString = localStorage.getItem('permisos') ?? ''
  
    if (permisosString !== '') {
      const permisos: string[] = JSON.parse(permisosString)
      for (let i = permisos.length - 1; i >= 0; i--) {
        if (permisos[i] === name.toUpperCase()) {
          return true
        }
      }
  
      return false
    }
}