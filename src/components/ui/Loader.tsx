import { Loader } from "lucide-react";

const LoaderSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full py-10">
      <Loader className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  );
};

export default LoaderSpinner;
