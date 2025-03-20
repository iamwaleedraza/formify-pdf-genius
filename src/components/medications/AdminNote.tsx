
const AdminNote = () => {
  return (
    <div className="bg-muted mt-4 p-4 rounded-md">
      <p className="text-sm text-muted-foreground">
        Note: Only administrators can add, edit, or delete medications and supplements. 
        If you need to make changes, please contact an administrator.
      </p>
    </div>
  );
};

export default AdminNote;
