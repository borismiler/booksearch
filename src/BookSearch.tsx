import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormControl, Container, Row, Col, Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

type Book = {
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    isbn?: string[];
    number_of_pages_median?: number;
};

const BookSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [sortByYear, setSortByYear] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            if (query.length < 3) return;
            try {
                const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
                setBooks(response.data.docs);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        const debounceFetchBooks = setTimeout(fetchBooks, 500);
        return () => clearTimeout(debounceFetchBooks);
    }, [query]);

    const sortedBooks = [...books].sort((a, b) => {
        if (sortByYear) {
            return (a.first_publish_year || 0) - (b.first_publish_year || 0);
        }
        return 0; // Default to relevance sorting
    });

    return (
        <Container>
            <Form className="my-4">
                <FormControl
                    type="text"
                    placeholder="Search for a book"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </Form>
            <ToggleButtonGroup
                type="radio"
                name="sortOptions"
                defaultValue={false}
                onChange={(value) => setSortByYear(value)}
            >
                <ToggleButton value={0} id={'relevanceBtn'}>Relevance</ToggleButton>
                <ToggleButton value={1} id={'yearBtn'}>Year</ToggleButton>
            </ToggleButtonGroup>
            <Row>
                {sortedBooks.map((book, index) => (
                    <Col key={index} sm={12} md={6} lg={4}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>{book.title}</Card.Title>
                                <Card.Text>
                                    <strong>Author(s):</strong> {book.author_name?.join(', ') || 'N/A'}<br />
                                    <strong>Year:</strong> {book.first_publish_year || 'N/A'}<br />
                                    <strong>ISBN:</strong> {book.isbn?.[0] || 'N/A'}<br />
                                    <strong>Pages:</strong> {book.number_of_pages_median || 'N/A'}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default BookSearch;
