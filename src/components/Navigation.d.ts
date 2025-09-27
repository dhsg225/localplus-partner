import React from 'react';
import type { UnifiedUser } from '../../shared/services/authService';
interface NavigationProps {
    currentPage: string;
    onPageChange: (page: string) => void;
    user: UnifiedUser;
    onLogout: () => Promise<void>;
    showAdminLink?: boolean;
}
declare const Navigation: React.FC<NavigationProps>;
export default Navigation;
