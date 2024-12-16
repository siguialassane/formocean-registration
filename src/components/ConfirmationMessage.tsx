interface ConfirmationMessageProps {
  firstName?: string;
  lastName?: string;
}

const ConfirmationMessage = ({ firstName, lastName }: ConfirmationMessageProps) => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Félicitations {firstName} {lastName} ! 🎉
      </h1>
      
      <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
        <p className="font-medium">
          Votre inscription a été validée avec succès.
        </p>
        <p>
          Vous recevrez prochainement un e-mail de confirmation avec les prochaines étapes.
        </p>
        <p>
          Nous sommes impatients de vous accueillir à notre événement.
        </p>
        <p className="font-medium">
          Merci d'avoir pris le temps de vous inscrire !
        </p>
      </div>
    </div>
  );
};

export default ConfirmationMessage;