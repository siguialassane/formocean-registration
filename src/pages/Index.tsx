import SignupForm from "@/components/SignupForm";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Inscription</h1>
        <SignupForm />
        <p className="text-center text-sm text-gray-500 mt-4">@exias</p>
      </div>
    </div>
  );
};

export default Index;