import SignupForm from "@/components/SignupForm";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Inscription</h1>
        
        <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed">
          Bienvenue ! 🎉 <br />
          Veuillez renseigner tous les champs afin de vous inscrire à notre événement.
        </p>
        
        <SignupForm />
        <p className="text-center text-sm text-gray-500 mt-4">@exias</p>
      </div>
    </div>
  );
};

export default Index;