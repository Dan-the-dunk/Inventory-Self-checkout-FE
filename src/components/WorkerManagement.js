import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField // Assuming a simple modal form for editing
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

// --- Placeholder API functions ---
// Replace these with your actual API calls
const fetchWorkers = async () => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Replace with actual fetch logic: GET /api/workers
    return [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 30, position: 'Operator', facial_data: 'ref_123', designated_area: 'V1_factory' },
        { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 45, position: 'Supervisor', facial_data: 'ref_456', designated_area: 'V2_factory' },
        // ... more workers
    ];
};

const updateWorker = async (workerData) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updating worker:', workerData);
    // Replace with actual fetch logic: PUT /api/workers/{workerData.id}
    return { success: true };
};

const deleteWorker = async (workerId) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleting worker:', workerId);
     // Replace with actual fetch logic: DELETE /api/workers/{workerId}
    return { success: true };
};
// --- End Placeholder API functions ---


// --- Placeholder Auth Check ---
// Replace this with your actual role checking logic
const useUserRole = () => {
    // Example: Fetch role from context or auth state
    // For demo, assuming 'admin' role. Replace with 'manager', 'employee', etc.
    return 'admin';
};
// --- End Placeholder Auth Check ---

function WorkerManagement() {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const currentUserRole = useUserRole(); // Get current user's role

    // Check if user has permission
    const canManageWorkers = currentUserRole === 'admin' || currentUserRole === 'manager';

    useEffect(() => {
        if (!canManageWorkers) {
            setError("You don't have permission to access this page.");
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchWorkers()
            .then(data => {
                setWorkers(data);
                setError(null);
            })
            .catch(err => {
                console.error("Failed to fetch workers:", err);
                setError("Failed to load worker data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [canManageWorkers]); // Re-run if role changes (though unlikely in SPA context usually)

    // --- Modal Handlers ---
    const handleViewOpen = (worker) => {
        setSelectedWorker(worker);
        setIsViewModalOpen(true);
    };

    const handleEditOpen = (worker) => {
        setSelectedWorker({ ...worker }); // Clone worker data for editing
        setIsEditModalOpen(true);
    };

     const handleDeleteOpen = (worker) => {
        setSelectedWorker(worker);
        setIsDeleteConfirmOpen(true);
    };

    const handleCloseModals = () => {
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteConfirmOpen(false);
        setSelectedWorker(null); // Clear selection
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setSelectedWorker(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        if (!selectedWorker) return;
        setLoading(true); // Indicate saving
        try {
            const result = await updateWorker(selectedWorker);
            if (result.success) {
                // Update local state
                setWorkers(prevWorkers =>
                    prevWorkers.map(w => w.id === selectedWorker.id ? selectedWorker : w)
                );
                handleCloseModals();
            } else {
                 setError("Failed to save changes."); // Handle API error display
            }
        } catch (err) {
             console.error("Error updating worker:", err);
             setError("An error occurred while saving.");
        } finally {
            setLoading(false);
        }
    };

     const handleDeleteConfirm = async () => {
        if (!selectedWorker) return;
        setLoading(true); // Indicate deleting
         try {
            const result = await deleteWorker(selectedWorker.id);
             if (result.success) {
                // Update local state
                setWorkers(prevWorkers =>
                    prevWorkers.filter(w => w.id !== selectedWorker.id)
                );
                handleCloseModals();
            } else {
                 setError("Failed to delete worker."); // Handle API error display
            }
        } catch (err) {
            console.error("Error deleting worker:", err);
            setError("An error occurred while deleting.");
        } finally {
             setLoading(false);
        }
    };


    // --- Render Logic ---
    if (loading) {
        return <Container><CircularProgress /></Container>;
    }

    if (error) {
        return <Container><Typography color="error">{error}</Typography></Container>;
    }

     // Render message if user lacks permissions (redundant if routing handles this, but good fallback)
    if (!canManageWorkers) {
         return <Container><Typography color="error">Access Denied.</Typography></Container>;
    }


    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom component="h1" sx={{ my: 2 }}>
                Worker Management
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="worker table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Position</TableCell>
                            {/* Facial Info might be sensitive or complex - display carefully */}
                            {/* <TableCell>Facial Info Ref</TableCell> */}
                            <TableCell>Designated Area</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workers.map((worker) => (
                            <TableRow key={worker.id}>
                                <TableCell component="th" scope="row">{worker.name}</TableCell>
                                <TableCell>{worker.email}</TableCell>
                                <TableCell>{worker.age}</TableCell>
                                <TableCell>{worker.position}</TableCell>
                                {/* <TableCell>{worker.facial_data}</TableCell> */}
                                <TableCell>{worker.designated_area}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleViewOpen(worker)} size="small" aria-label="view">
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditOpen(worker)} size="small" aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOpen(worker)} size="small" aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

             {/* View Modal (Example - simple display) */}
            <Dialog open={isViewModalOpen} onClose={handleCloseModals}>
                <DialogTitle>Worker Details</DialogTitle>
                <DialogContent>
                    {selectedWorker && (
                        <Box>
                            <Typography><strong>Name:</strong> {selectedWorker.name}</Typography>
                            <Typography><strong>Email:</strong> {selectedWorker.email}</Typography>
                            <Typography><strong>Age:</strong> {selectedWorker.age}</Typography>
                            <Typography><strong>Position:</strong> {selectedWorker.position}</Typography>
                            <Typography><strong>Area:</strong> {selectedWorker.designated_area}</Typography>
                            <Typography><strong>Facial Ref:</strong> {selectedWorker.facial_data}</Typography>
                            {/* Add more fields as needed */}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModals}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Modal (Example - simple form) */}
            <Dialog open={isEditModalOpen} onClose={handleCloseModals}>
                <DialogTitle>Edit Worker</DialogTitle>
                <DialogContent>
                    {selectedWorker && (
                        <Box component="form" noValidate autoComplete="off">
                             {/* Add TextField components for each editable field */}
                             <TextField margin="dense" name="name" label="Name" type="text" fullWidth variant="standard" value={selectedWorker.name || ''} onChange={handleEditChange}/>
                             <TextField margin="dense" name="email" label="Email" type="email" fullWidth variant="standard" value={selectedWorker.email || ''} onChange={handleEditChange}/>
                             <TextField margin="dense" name="age" label="Age" type="number" fullWidth variant="standard" value={selectedWorker.age || ''} onChange={handleEditChange}/>
                             <TextField margin="dense" name="position" label="Position" type="text" fullWidth variant="standard" value={selectedWorker.position || ''} onChange={handleEditChange}/>
                             <TextField margin="dense" name="designated_area" label="Designated Area" type="text" fullWidth variant="standard" value={selectedWorker.designated_area || ''} onChange={handleEditChange}/>
                              {/* Facial data editing might be complex - maybe just display or link */}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModals}>Cancel</Button>
                    <Button onClick={handleSaveChanges} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onClose={handleCloseModals}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the worker "{selectedWorker?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModals}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" disabled={loading}>
                         {loading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

export default WorkerManagement;
