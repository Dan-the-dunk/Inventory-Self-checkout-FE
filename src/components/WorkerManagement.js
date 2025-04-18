import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const WorkerManagement = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [canManageWorkers, setCanManageWorkers] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (!token) {
            navigate('/');
            return;
        }

        const hasPermission = role === 'admin' || role === 'manager';
        setCanManageWorkers(hasPermission);

        if (!hasPermission) {
            setError("You don't have permission to view this page.");
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);
        axios.get('http://localhost:5000/workers', {
            headers: { Authorization: token ? `Bearer ${token}` : '' }
        })
        .then(response => {
            if (isMounted) {
                setWorkers(response.data);
                setError(null);
            }
        })
        .catch(err => {
            if (isMounted) {
                console.error("Failed to fetch workers:", err);
                setError("Failed to load worker data.");
            }
        })
        .finally(() => {
            if (isMounted) {
                setLoading(false);
            }
        });
        
        return () => { isMounted = false; };
    }, [navigate]);

    // --- Modal Handlers ---
    const handleViewOpen = (worker) => {
        setSelectedWorker(worker);
        setIsViewModalOpen(true);
    };

    const handleEditOpen = (worker) => {
        setSelectedWorker({ ...worker });
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
        setSelectedWorker(null);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setSelectedWorker(prev => ({ ...prev, [name]: value }));
    };

    const updateWorker = async (workerData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/workers/${workerData.id}`,
                workerData,
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating worker:', error);
            return { success: false };
        }
    };

    const deleteWorker = async (workerId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/workers/${workerId}`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting worker:', error);
            return { success: false };
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedWorker) return;
        setLoading(true);
        try {
            const result = await updateWorker(selectedWorker);
            if (result.success) {
                setWorkers(prevWorkers =>
                    prevWorkers.map(w => (w.id === selectedWorker.id ? selectedWorker : w))
                );
                handleCloseModals();
            } else {
                setError("Failed to save changes.");
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
        setLoading(true);
        try {
            const result = await deleteWorker(selectedWorker.id);
            if (result.success) {
                setWorkers(prevWorkers =>
                    prevWorkers.filter(w => w.id !== selectedWorker.id)
                );
                handleCloseModals();
            } else {
                setError("Failed to delete worker.");
            }
        } catch (err) {
            console.error("Error deleting worker:", err);
            setError("An error occurred while deleting.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            {/* Back Button */}
            <Button 
                onClick={() => navigate('/dashboard')}
                sx={{ mt: 2, mb: 2, background: 'linear-gradient(to right, #38a169, #2f855a)', color: 'white', '&:hover': { background: 'linear-gradient(to right, #2f855a, #38a169)' } }}
            >
                &larr; Back
            </Button>

            <Typography variant="h4" gutterBottom component="h1" sx={{ my: 2 }}>
                Worker Management
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="worker table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Area</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workers.map(worker => (
                            <TableRow key={worker.id}>
                                <TableCell component="th" scope="row">{worker.name}</TableCell>
                                <TableCell>{worker.email}</TableCell>
                                <TableCell>{worker.position}</TableCell>
                                <TableCell>{worker.area}</TableCell>
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

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onClose={handleCloseModals}>
                <DialogTitle>Worker Details</DialogTitle>
                <DialogContent>
                    {selectedWorker && (
                        <Box>
                            <Typography><strong>Name:</strong> {selectedWorker.name}</Typography>
                            <Typography><strong>Email:</strong> {selectedWorker.email}</Typography>
                            <Typography><strong>Position:</strong> {selectedWorker.position}</Typography>
                            <Typography><strong>Area:</strong> {selectedWorker.area}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModals}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onClose={handleCloseModals}>
                <DialogTitle>Edit Worker</DialogTitle>
                <DialogContent>
                    {selectedWorker && (
                        <Box component="form" noValidate autoComplete="off">
                            <TextField margin="dense" name="name" label="Name" type="text" fullWidth variant="standard" value={selectedWorker.name || ''} onChange={handleEditChange}/>
                            <TextField margin="dense" name="email" label="Email" type="email" fullWidth variant="standard" value={selectedWorker.email || ''} onChange={handleEditChange}/>
                            <TextField margin="dense" name="position" label="Position" type="text" fullWidth variant="standard" value={selectedWorker.position || ''} onChange={handleEditChange}/>
                            <TextField margin="dense" name="area" label="Area" type="text" fullWidth variant="standard" value={selectedWorker.area || ''} onChange={handleEditChange}/>
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
};

export default WorkerManagement;
