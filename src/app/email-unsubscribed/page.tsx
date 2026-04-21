export default function EmailUnsubscribedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Email desactivado</h1>
        <p className="text-muted-foreground">
          Ya no recibiras notificaciones por email.
          Puedes reactivarlas desde tu perfil en cualquier momento.
        </p>
      </div>
    </div>
  );
}
