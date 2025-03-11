import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function Pagination({currentPage, totalPages, setCurrentPage, onNext, onPrev}:PaginationProps) {
  return (
    <div className="flex justify-center items-center mt-5 text-xs">
      <button
        onClick={onPrev}
        className="mr-2 w-6 h-6 bg-slate-800 rounded-md hover:bg-cp-primary hover:text-cp-dark"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          onClick={() => setCurrentPage(i + 1)}
          className={`mr-2 w-6 h-6 hover:bg-cp-primary hover:text-cp-dark rounded-md ${
            currentPage === i + 1
              ? "text-cp-dark font-bold bg-cp-primary"
              : "bg-slate-800 text-light"
          }`}
          key={i}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={onNext}
        className="mr-2 w-6 h-6 bg-slate-800 rounded-md hover:bg-cp-primary hover:text-cp-dark"
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
}
