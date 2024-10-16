'use client';

import MainLayout from 'src/layouts/main';
import AuthGuard from 'src/guards/auth-guard';
import EcommerceLayout from 'src/layouts/ecommerce';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <MainLayout>
        <EcommerceLayout>{children}</EcommerceLayout>
      </MainLayout>
    </AuthGuard>
  );
}
