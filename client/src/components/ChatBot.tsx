import React, { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, CircularProgress, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { theme } from './theme';
import { API_URL } from './constants';

interface Transaction {
    id: number;
    date: string;
    note: string;
    place: string;
    category: string;
    amount: number;
    positive: number;
    account: string;
}

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        axios.get<Transaction[]>(`${API_URL}api/transactions`)
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the transactions!", error);
            });
    };

    function filterTransactionsByDate(transactions: Transaction[], startDate: string, endDate: string): Transaction[] {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= start && transactionDate <= end;
        });
    }

    function extractDates(text: string): { startDate: string; endDate: string } {
        const startDateMatch = text.match(/startDate:\s*"(\d{4}-\d{2}-\d{2})"/);
        const endDateMatch = text.match(/endDate:\s*"(\d{4}-\d{2}-\d{2})"/);

        return {
            startDate: startDateMatch ? startDateMatch[1] : "",
            endDate: endDateMatch ? endDateMatch[1] : ""
        };
    }

    //const filteredTransactions = filterTransactionsByDate(transactions, extractDates(input).startDate, extractDates(input).endDate);
    //console.log(filteredTransactions);



    const handleSend = () => {
        if (!input.trim()) return;

        // Extract dates and filter transactions before resetting the input
        const dates = extractDates(input);
        var modifiedInput = input;
        if (dates.startDate && dates.endDate) {
            const filteredTransactions = filterTransactionsByDate(transactions, dates.startDate, dates.endDate);
            console.log(filteredTransactions);

            const updatedString = input.replace(/\s*\{[^}]*\}/, '');
            console.log(updatedString); // This logs the string after removing the {}

            modifiedInput = updatedString + JSON.stringify(filteredTransactions);
        }

        console.log(modifiedInput);

        const newMessage: Message = { sender: 'user', text: modifiedInput };
        const updatedMessages = [...messages, newMessage];

        setLoading(true);

        axios.post(`${API_URL}api/chat`, { messages: updatedMessages }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            const botMessage: Message = { sender: 'bot', text: response.data };
            setMessages([...updatedMessages, botMessage]);
            setLoading(false);
        }).catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
        setInput('');
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    const formatText = (text: string) => {
        const formattedText = text.replace(/\n/g, '<br/>').replace(/(\d+\.\s)/g, '<br/>$1');
        return { __html: formattedText };
    };

    return (
        <ThemeProvider theme={theme}>
            <Container style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box my={2} flexGrow={1}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Personal Financial Advisor - ChatGPT
                    </Typography>
                    <Typography mb={2}>
                        Example: Give me personalized, detailed budgeting advice based on the following transaction categories: {'{startDate: \'2024-06-01\', endDate: \'2024-06-20\'}'}
                    </Typography>
                    <Paper style={{ height: 'calc(100vh - 130px)', overflowY: 'auto', padding: 16, marginBottom: 16 }}>
                        {messages.map((msg, index) => (
                            <Box key={index} display="flex" justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'} mb={1}>
                                <Paper style={{ padding: '8px 16px', backgroundColor: msg.sender === 'user' ? '#dcf8c6' : '#f1f1f1' }}>
                                    <Typography dangerouslySetInnerHTML={formatText(msg.text)} />
                                </Paper>
                            </Box>
                        ))}
                        {loading && (
                            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                                <CircularProgress />
                                <Typography variant="body1" style={{ marginLeft: 8 }}>Thinking...</Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>
                <Box display="flex" alignItems="center" style={{ position: 'sticky', bottom: 0, width: '100%', padding: '8px 16px', backgroundColor: '#fff' }}>
                    <TextField
                        fullWidth
                        multiline
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        variant="outlined"
                        style={{ marginRight: 8, overflow: 'hidden' }}
                        InputProps={{
                            style: {
                                maxHeight: '200px',
                                overflow: 'auto'
                            }
                        }}
                    />
                    <Button sx={{ height: '56px' }} variant="contained" color="primary" onClick={handleSend}>
                        Send
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ChatBot;
