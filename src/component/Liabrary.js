import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios'; // Fixes 'axios' is not defined
import BookList from './BookList'; // Fixes 'BookList' is not defined
import AddBookButton from './AddBookButton'; // Fixes 'AddBookButton' is not defined
import BookForm from './BookForm';

// --- 1. Move helper function here so it's defined ---
const performLocalFilter = (data, classFilter, searchTerm) => {
    if (!data) return [];
    let filtered = [...data];
    const lowerSearch = searchTerm ? searchTerm.toLowerCase() : '';

    if (classFilter && classFilter !== 'All') {
        filtered = filtered.filter(book => 
            String(book.Class || '').toLowerCase() === classFilter.toLowerCase()
        );
    }

    if (lowerSearch) {
        filtered = filtered.filter(book => 
            Object.values(book).some(value => 
                String(value || '').toLowerCase().includes(lowerSearch)
            )
        );
    }
    return filtered;
};

function Liabrary() {
    const [allBooks, setAllBooks] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('All');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null);

    // Fixes 'api' is not defined
    const api = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    // --- 2. Data Fetching ---
    const fetchBooks = useCallback(async () => { 
        setLoading(true);
        try {
            const response = await axios.get(`${api}/api/books`);
            // Handling both array and object responses
            const data = Array.isArray(response.data) ? response.data : (response.data.books || []);
            setAllBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setAllBooks([]);
        } finally {
            setLoading(false);
        }
    }, [api]); 

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // --- 3. Local Filtering Logic (Automatic) ---
    const filteredBooks = useMemo(() => {
        return performLocalFilter(allBooks, selectedClass, searchTerm);
    }, [allBooks, selectedClass, searchTerm]);

    const handleSearch = (classQ, searchT) => { 
        setSelectedClass(classQ);
        setSearchTerm(searchT); 
    };

    // --- 4. Action Handlers ---
    const handleDelete = async (srNo) => {
        if (!window.confirm(`Are you sure you want to delete book: ${srNo}?`)) return;
        try {
            await axios.delete(`${api}/api/books/${srNo}`);
            alert('Deleted successfully');
            fetchBooks(); 
        } catch (error) {
            console.error('Delete error:', error);
        }
    };
    
    const handleEditClick = (book) => {
        setBookToEdit(book);
        setIsEditing(true);
    };

    const handleSaveEdit = async (updatedData) => {
        try {
            await axios.put(`${api}/api/books/${updatedData.SrNo}`, updatedData);
            alert('Updated successfully');
            setIsEditing(false);
            fetchBooks(); 
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <div style={{ marginBottom: '10px', textAlign: 'right' }}>
                <AddBookButton onBookAdded={fetchBooks} /> 
            </div>

            <BookList
                books={filteredBooks} 
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                handleSearch={handleSearch} 
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
            />

            {isEditing && bookToEdit && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                }}>
                    <BookForm
                        initialBook={bookToEdit}
                        onBookUpdated={handleSaveEdit}
                        onClose={() => setIsEditing(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default Liabrary;
