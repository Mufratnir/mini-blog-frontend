import React, { useEffect, useState } from 'react';
import MainTable from '../components/tables/MainTable';
import { Label, TextInput, Select, Button } from 'flowbite-react';
import { apiRequest } from '../axios/api';
import { useUI } from '../axios/UIContext'; 
import { set } from 'lodash';

const Categories = () => {
  const { loader, setLoader, alert, setAlert, formErrors, setFormErrors } = useUI();
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
  });

  const fetchCategories = async () => {
    const offset = (currentPage - 1) * limit;

    const response: any = await apiRequest({
      method: 'GET',
      url: '/categories',
      params: { search, limit, offset },
    });

    if (response) {
      // adjust according to backend
      const list = response.data?.categories ?? response.categories ?? response.data ?? [];
      const total = response.data?.total ?? response.total ?? list.length;

      setCategories(list);
      setLastPage(Math.ceil(total / limit) || 1);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

   const handleSubmit = async () => {
     setFormErrors({});
     setLoader(true);

     const method = editingId !== null ? 'PUT' : 'POST';
     const url = editingId !== null ? `/categories/${editingId}` : '/categories';

     const response: any = await apiRequest({
       method,
       url,
       data: formData,
     });

     setLoader(false);

     if (response?.errors) {
       // Laravel validation errors: { name: ["The name has already been taken."] }
       setFormErrors(response.errors);
     } else if (response?.message) {
       setAlert({ type: 'success', message: response.message });
       handleFormClose();
       fetchCategories();
     }
   };

const handleEdit = (index: number) => {
  const category = categories[index];
  console.log('Editing category:', category);
  setFormData({
    name: category.name,
    status: category.status === 'active' ? 'active' : 'inactive',
  });
  setEditingId(category.id);
  setIsFormOpen(true);
};

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const res: any = await apiRequest(
        {
          method: 'PUT',
          url: `/categories/${editingId}`,
          data: formData,
        },
        // setLoader,
        // setAlert,
        // setFormErrors,
      );

      if (res.success !== false) {
        // setAlert({ message: 'Category updated successfully', type: 'success' });
        // setShowForm(false);
        setEditingId(null);
        fetchCategories(); // refresh the table
      }
    } catch (error) {
      console.error('Update error:', error);
      // setAlert({ message: 'Failed to update category', type: 'failure' });
    }
  };
const handleDelete = async (index: number) => {
  const category = categories[index];
  const confirmDelete = window.confirm('Are you sure you want to delete this category?');
  if (!confirmDelete) return;

  try {
    const res: any = await apiRequest(
      {
        method: 'DELETE',
        url: `/categories/${category.id}`,
      },
      // setLoader,
      // setAlert,
    );

    if (res.success !== false) {
      // setAlert({ message: 'Category deleted successfully', type: 'success' });
      fetchCategories(); // refresh the table
    }
  } catch (error) {
    console.error('Delete error:', error);
    // setAlert({ message: 'Failed to delete category', type: 'failure' });
  }
};

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: '', status: 'active' });
  };

  return (
    <>
      <MainTable
        title="Categories"
        buttonText="Add Category"
        data={categories}
        onButtonClick={() => setIsFormOpen(true)}
        handleEditClick={handleEdit}
        handleDeleteClick={handleDelete}
        showImage={false}
        titleColumnLabel="Category Name"
        searchValue={search}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {isFormOpen && (
        <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black/50 z-40">
          <div className="w-2/3 rounded-xl shadow-md bg-white p-6">
            <h5 className="card-title mb-6">{editingId ? 'Edit Category' : 'Add Category'}</h5>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-6">
                <Label>Category</Label>
                <TextInput
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Category"
                />
                {formErrors.name &&
                  formErrors.name.map((msg, i) => (
                    <p key={i} className="text-red-600 text-sm mt-1">
                      {msg}
                    </p>
                  ))}
              </div>
              <div className="col-span-6">
                <Label>Status</Label>
                <Select id="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">InActive</option>
                </Select>
              </div>
              <div className="col-span-12 flex gap-3 mt-4">
                <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Submit'}</Button>
                <Button color="error" onClick={handleFormClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
