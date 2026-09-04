// Gerenciador de Autenticação - Senhas protegidas via variáveis de ambiente
export const authService = {
  getGuestPassword(): string {
    return (import.meta.env.VITE_GUEST_PASSWORD || 'CASAMENTO2026').trim();
  },

  getAdminPassword(): string {
    return (import.meta.env.VITE_ADMIN_PASSWORD || 'ADMIN123').trim();
  },

  validateGuestPassword(password: string): boolean {
    if (!password) return false;
    const cleanInput = password.trim();
    const guestPass = this.getGuestPassword();
    return cleanInput.toLowerCase() === guestPass.toLowerCase() || cleanInput === guestPass;
  },

  validateAdminPassword(password: string): boolean {
    if (!password) return false;
    const cleanInput = password.trim();
    const adminPass = this.getAdminPassword();
    return cleanInput.toLowerCase() === adminPass.toLowerCase() || cleanInput === adminPass;
  },

  setGuestAuthenticated(value: boolean): void {
    if (value) {
      localStorage.setItem('wedding_guest_auth', 'true');
    } else {
      localStorage.removeItem('wedding_guest_auth');
    }
  },

  isGuestAuthenticated(): boolean {
    return localStorage.getItem('wedding_guest_auth') === 'true';
  },

  setAdminAuthenticated(value: boolean): void {
    if (value) {
      localStorage.setItem('wedding_admin_auth', 'true');
    } else {
      localStorage.removeItem('wedding_admin_auth');
    }
  },

  isAdminAuthenticated(): boolean {
    return localStorage.getItem('wedding_admin_auth') === 'true';
  },

  logout(): void {
    localStorage.removeItem('wedding_guest_auth');
    localStorage.removeItem('wedding_admin_auth');
  },
};
