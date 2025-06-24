import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function StepHeader({ title, statusLabel , statusValue }) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/mobile-serial-app/entryScreen');
  };

  return (
    <div className="w-full flex justify-between items-center px-4 py-2 border-b border-[#DEE1E6] bg-white whitespace-nowrap">
      <h1 className="text-lg font-[800] text-[#153d64] mt-1">
        {title}
      </h1>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-[#153D64] font-[800] text-base ">{statusLabel}</span>
          <span className="text-[#EFB034] font-[800] text-base">{statusValue}</span>
        </div>

        <AiFillHome
          size={20}
          className="text-[#153d64] cursor-pointer"
          onClick={handleHomeClick}
        />
      </div>
    </div>
  );
}
