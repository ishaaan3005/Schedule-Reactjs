import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from './Navbar';

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: calc(100% - 22px);
  min-height: 100px;
  overflow-y: auto;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Message = styled.div`
  margin-top: 10px;
  color: ${({ isError }) => (isError ? 'red' : 'green')};
  font-size: 14px;
`;

const AppointmentForm = () => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/appointments');
      setAppointments(response.data);
    } catch (error) {
      setError('Error fetching appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !time || !reason) {
      setError('Please fill out all fields');
      return;
    }

    try {
      if (editingAppointmentId) {
        await axios.put(`http://localhost:5000/appointments/${editingAppointmentId}`, { name, time, reason });
        setEditingAppointmentId(null);
        setSuccessMessage('Appointment updated successfully');
      } else {
        await axios.post('http://localhost:5000/appointments', { name, time, reason });
        setSuccessMessage('Appointment booked successfully');
      }
      fetchAppointments();
      setName('');
      setTime('');
      setReason('');
    } catch (error) {
      setError('Error submitting appointment');
    }
  };

  const handleEditAppointment = (id, name, time, reason) => {
    setEditingAppointmentId(id);
    setName(name);
    setTime(time);
    setReason(reason);
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/appointments/${id}`);
      fetchAppointments();
      setSuccessMessage('Appointment deleted successfully');
    } catch (error) {
      setError('Error deleting appointment');
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <h2>Book Appointment</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <TextArea
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button type="submit">{editingAppointmentId ? 'Update' : 'Book'}</Button>
        </Form>
        {error && <Message isError>{error}</Message>}
        {successMessage && <Message>{successMessage}</Message>}
        <h2>Appointments</h2>
        {isLoading && <p>Loading...</p>}
        {!isLoading && (
          <ul>
            {appointments.map(appointment => (
              <li key={appointment.id}>
                <div>Name: {appointment.name}</div>
                <div>Time: {new Date(appointment.time).toLocaleString()}</div>
                <div>Reason:</div>
                <TextArea readOnly value={appointment.reason} />
                <div>Booked at: {new Date(appointment.timestamp).toLocaleString()}</div>
                <Button onClick={() => handleEditAppointment(appointment.id, appointment.name, appointment.time, appointment.reason)}>Edit</Button>
                <Button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
};

export default AppointmentForm;
