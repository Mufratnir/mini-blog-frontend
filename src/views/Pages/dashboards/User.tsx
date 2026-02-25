import { Button, Label, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import MainTable from 'src/components/tables/MainTable';
import { apiRequest } from 'src/axios/api';
import { useUI } from 'src/axios/UIContext';

const User = () => {
  const { setLoader, setAlert, formErrors, setFormErrors } = useUI();

  // ==================== State ====================
  const [users, setUsers] = useState<any[]>([]); // Users list
  const [currentPage, setCurrentPage] = useState(1); // Pagination current page
  const [lastPage, setLastPage] = useState(1); // Last page from API
  const [search, setSearch] = useState(''); // Search query
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isEdit, setIsEdit] = useState(false); // Modal visibility
  const [editingUserId, setEditingUserId] = useState<number | null>(null); // Edit mode user ID


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'moderator',
    status: 'active',
  });

  // ==================== FETCH USERS ====================
  const fetchUsers = async () => {
    const res: any = await apiRequest({
      method: 'GET',
      url: `/admin/users?search=${search}&page=${currentPage}`,
      setLoader,
      setAlert,
      setFormErrors,
    });

    if (res?.success) {
      setUsers(res.data.data || []);
      setLastPage(res.data.last_page || 1);
    }
  };

  useEffect(() => {
    fetchUsers();
//     console.log(users);
  }, [currentPage, search]);

  // ==================== HANDLERS ====================

  // Search input
  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Submit form (add or edit)
  const handleSubmit = async () => {
    setFormErrors({});
    if (isEdit ) {
      const res: any = await apiRequest({
        method: 'PUT',
        url: `/admin/users/${editingUserId}`,
        data: {
          ...formData,
          password: formData.password || undefined,
        },
        setLoader,
        setAlert,
        setFormErrors,
      });

      if (res?.success) {
        setShowModal(false);
        setEditingUserId(null);
        fetchUsers(); // Refresh list
      }
    } else {
      // ===== CREATE USER =====
      const res: any = await apiRequest({
        method: 'POST',
        url: '/admin/create-moderator',
        data: formData,
        setLoader,
        setAlert,
        setFormErrors,
      });

      if (res?.success) {
        setShowModal(false);
        fetchUsers(); // Refresh list
      }
    }

    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'moderator',
      status: 'active',
    });
  };

  // Open modal and populate form for edit
  const handleEditClick = (index: any, id) => {
    setEditingUserId(id);
    const user = users[index];
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // blank means keep current
      role: user.role || 'moderator',
      status: user.status || 'active',
    });
    console.log('Editing User:', formData);
    setFormErrors({});
    setShowModal(true);
    setIsEdit(true);
  };

  // Delete user
  const handleDeleteClick = async (user: any) => {
    if (!window.confirm(`Are you sure you want to delete "${user.name}"?`)) return;

    const res: any = await apiRequest({
      method: 'DELETE',
      url: `/admin/users/${user.id}`,
      setLoader,
      setAlert,
      setFormErrors,
    });

    if (res?.success) fetchUsers(); // Refresh list
  };

  // Toggle active/inactive status
  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';

    const res: any = await apiRequest({
      method: 'PATCH',
      url: `/admin/users/${user.id}/status`,
      data: { status: newStatus },
      setLoader,
      setAlert,
      setFormErrors,
    });

    if (res?.success) fetchUsers(); // Refresh list
  };

  // ==================== UI ====================
  return (
    <>
      <MainTable
        title="All Users"
        buttonText="Add Moderator"
        data={users}
        onButtonClick={() => {
          setEditingUserId(null);
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'moderator',
            status: 'active',
          });
          setFormErrors({});
          setShowModal(true);
        }}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        handleToggleStatus={handleToggleStatus}
        showImage={false}
        titleColumnLabel="User Name"
        searchValue={search}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={(p) => setCurrentPage(p)}
        showRole={true}
      />

      {showModal && (
        <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black/50 z-40">
          <div className="w-2/3 rounded-xl shadow-md bg-white p-6">
            <h5 className="card-title">{isEdit ? 'Edit User' : 'Create Moderator'}</h5>

            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className="lg:col-span-6 col-span-12 flex flex-col gap-4">
                <div>
                  <Label>Your Name</Label>
                  <TextInput
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    color={formErrors.name ? 'failure' : undefined}
                  />
                </div>

                <div>
                  <Label>Your Email</Label>
                  <TextInput
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isEdit} // Disable editing email
                    color={formErrors.email ? 'failure' : undefined}
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <TextInput
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isEdit ? 'Leave blank to keep current password' : undefined}
                    color={formErrors.password ? 'failure' : undefined}
                  />
                </div>
              </div>

              <div className="lg:col-span-6 col-span-12 flex flex-col gap-4">
                <div>
                  <Label>Role</Label>
                  <Select id="role" value={formData.role} onChange={handleChange}>
                    <option value="moderator">Moderator</option>
                    <option value="blogger">User</option>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select id="status" value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </div>
              </div>

              <div className="col-span-12 flex gap-3 mt-4">
                <Button color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button
                  color="gray"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUserId(null);
                  }}
                >
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

export default User;
