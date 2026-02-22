import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react';
import { useEffect,  useState } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import SearchBar from '../SearchBar';
import Pagination from '../Pagination';

type TableItem = {
  image?: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
};

type Props = {
  title: string;
  buttonText: string;
  data: TableItem[];
  onButtonClick: () => void;
  showImage?: boolean;
  titleColumnLabel?: string;
  handleEditClick: (index: number) => void;
  handleDeleteClick: (index: number) => void;

  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentPage?: number;
  lastPage?: number;
  onPageChange?: (page: number) => void;
};

const MainTable = ({
  title,
  buttonText,
  data,
  onButtonClick,
  showImage = true,
  titleColumnLabel,
  handleEditClick,
  handleDeleteClick,

  searchValue,
  onSearchChange,
  currentPage,
  lastPage,
  onPageChange,
}: Props) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'border-green-500 text-green-600';
      case 'InActive':
        return 'border-yellow-500 text-yellow-600';
      default:
        return 'border-gray-400 text-gray-600';
    }
  };

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('.action-menu')) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {onSearchChange && <SearchBar value={searchValue  || ''} onChange={onSearchChange}/>}
      <div className="rounded-xl shadow-md bg-white p-6 w-full">
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-semibold">{title}</h5>

          <Button size="sm" color="primary" onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
        {/* Table */}
        <div className="mt-4 ">
          <Table hoverable>
            <TableHead>
              <TableHeadCell className="p-6 text-base">
                {titleColumnLabel ?? (showImage ? 'Product / Title' : 'Title')}
              </TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="flex justify-end pe-6">Action</TableHeadCell>
            </TableHead>

            <TableBody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={index} className=" border-t border-gray-300 hover:bg-gray-50 ">
                    <TableCell className="whitespace-nowrap ps-6">
                      <div className="flex gap-3 items-center">
                        {showImage && item.image && (
                          <img
                            src={item.image}
                            alt="item"
                            className="h-[60px] w-[60px] rounded-md object-cover"
                          />
                        )}

                        <div className="max-w-56">
                          <h6 className="text-sm font-medium line-clamp-2">{item.name}</h6>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </TableCell>

                    <TableCell className="flex justify-end pe-6 relative">
                      {openMenuIndex === index && (
                        <div className="action-menu py-2 shadow-md bg-white rounded-2xl absolute right-15 top-6 z-10">
                          <div
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                            onClick={() => handleEditClick(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={16}
                              height={16}
                              viewBox="0 0 1792 1408"
                            >
                              <path
                                fill="currentColor"
                                d="m888 1056l116-116l-152-152l-116 116v56h96v96zm440-720q-16-16-33 1L945 687q-17 17-1 33t33-1l350-350q17-17 1-33m80 594v190q0 119-84.5 203.5T1120 1408H288q-119 0-203.5-84.5T0 1120V288Q0 169 84.5 84.5T288 0h832q63 0 117 25q15 7 18 23q3 17-9 29l-49 49q-14 14-32 8q-23-6-45-6H288q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113V994q0-13 9-22l64-64q15-15 35-7t20 29m-96-738l288 288l-672 672H640V864zm444 132l-92 92l-288-288l92-92q28-28 68-28t68 28l152 152q28 28 28 68t-28 68"
                              ></path>
                            </svg>{' '}
                            <span className="text-sm font-medium">Edit</span>
                          </div>
                          <div
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                            onClick={() => handleDeleteClick(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                              ></path>
                            </svg>{' '}
                            <span className="text-sm font-medium">Delete</span>
                          </div>
                        </div>
                      )}
                      <div
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                      >
                        <HiOutlineDotsVertical size={22} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {currentPage !== undefined && lastPage !== undefined && onPageChange && (
          <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={onPageChange} />
        )}
      </div>
    </>
  );
};

export default MainTable;
