import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onCancel: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  onCancel,
}) => {
  const handleCancel = () => {
    setSearchTerm("");
    onCancel();
  };

  return (
    <div className="flex items-center px-[15px] pt-[15px] bg-white">
      <div className="flex items-center bg-[#F5F5F5] p-2 rounded-full border border-gray-300 flex-grow mr-2">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 ml-2" />
        <input
          type="text"
          placeholder="搜尋..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent flex-grow outline-none px-2 text-black"
        />
      </div>

      <button onClick={handleCancel} className="text-[16px] text-blue-600 px-1">
        取消
      </button>
    </div>
  );
};

export default SearchBar;
